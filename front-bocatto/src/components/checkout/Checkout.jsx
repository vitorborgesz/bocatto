'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import AvisoRemovidos from '@/components/carrinho/AvisoRemovidos';
import CarrinhoVazio from '@/components/carrinho/CarrinhoVazio';
import ResumoPedido, { classeBotaoResumo } from '@/components/carrinho/ResumoPedido';
import { useDadosCarrinho } from '@/components/carrinho/useDadosCarrinho';
import CardEndereco from '@/components/checkout/CardEndereco';
import FormEndereco from '@/components/checkout/FormEndereco';
import { IconeMais, IconeSeta } from '@/components/ui/Icones';
import Mordida from '@/components/ui/Mordida';
import { useCart } from '@/contexts/CartContext';
import { mensagemDeErro } from '@/services/api';
import { listarEnderecos } from '@/services/enderecoService';
import { criarPedido } from '@/services/pedidoService';

// Tela /checkout: escolher (ou cadastrar) o endereço de entrega e confirmar o pedido.
export default function Checkout() {
  const router = useRouter();
  const { itens, subtotal, carregando, limpar } = useCart();
  const { taxa, removidos } = useDadosCarrinho();

  const [enderecos, setEnderecos] = useState({ status: 'carregando' });
  const [tentativa, setTentativa] = useState(0);
  const [escolhido, setEscolhido] = useState(null);
  const [formAberto, setFormAberto] = useState(false);
  const [envio, setEnvio] = useState({ status: 'parado' });

  useEffect(() => {
    let ativo = true;
    listarEnderecos()
      .then((lista) => ativo && setEnderecos({ status: 'pronto', lista }))
      .catch((erro) => {
        if (ativo) {
          setEnderecos({ status: 'erro', mensagem: mensagemDeErro(erro, 'Não foi possível carregar seus endereços.') });
        }
      });
    return () => {
      ativo = false;
    };
  }, [tentativa]);

  const lista = enderecos.lista ?? [];
  // Sem escolha ainda: o primeiro endereço já vem marcado.
  const enderecoId = lista.some((e) => e.id === escolhido) ? escolhido : (lista[0]?.id ?? null);
  // Sem nenhum endereço salvo, o formulário já aparece aberto.
  const mostrarForm = enderecos.status === 'pronto' && (formAberto || lista.length === 0);

  const aoSalvarEndereco = (endereco) => {
    setEnderecos({ status: 'pronto', lista: [...lista, endereco] });
    setEscolhido(endereco.id);
    setFormAberto(false);
  };

  const confirmar = async () => {
    if (!enderecoId) return;
    setEnvio({ status: 'enviando' });
    try {
      await criarPedido({ enderecoId, itens });
      setEnvio({ status: 'feito' });
      limpar();
      router.replace('/pedidos');
    } catch (erro) {
      setEnvio({
        status: 'erro',
        mensagem: erro.response
          ? mensagemDeErro(erro, 'Não foi possível enviar o pedido.')
          : 'Não conseguimos falar com o servidor. Tente de novo em instantes.',
      });
    }
  };

  // Pedido enviado: mostra a confirmação enquanto abre "Meus pedidos".
  if (envio.status === 'feito') {
    return (
      <section className="flex flex-col items-center py-24 text-center">
        <Mordida className="h-14 w-14 text-marca" />
        <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight">Pedido enviado!</h1>
        <p className="mt-2 text-suave">Já estamos levando você para acompanhar.</p>
      </section>
    );
  }

  return (
    <section className="pt-6 pb-12 sm:pt-12">
      <p className="text-xs font-bold tracking-[0.14em] text-marca uppercase">Último passo</p>
      <h1 className="mt-3 font-display text-5xl font-extrabold tracking-tight sm:text-6xl">Onde entregamos?</h1>

      <AvisoRemovidos nomes={removidos} />

      {!carregando && itens.length === 0 && <CarrinhoVazio />}

      {(carregando || itens.length > 0) && (
        <div className="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14">
          <div>
            {enderecos.status === 'carregando' && (
              <div aria-hidden="true" className="grid animate-pulse gap-3 sm:grid-cols-2">
                <div className="h-28 rounded-2xl bg-borda/60" />
                <div className="h-28 rounded-2xl bg-borda/60" />
              </div>
            )}

            {enderecos.status === 'erro' && (
              <div className="rounded-2xl border border-borda bg-white p-6 text-center">
                <p className="font-semibold">{enderecos.mensagem}</p>
                <button
                  type="button"
                  onClick={() => {
                    setEnderecos({ status: 'carregando' });
                    setTentativa((n) => n + 1);
                  }}
                  className="mt-4 rounded-full bg-marca px-5 py-2.5 text-sm font-semibold text-white hover:bg-marca-escura"
                >
                  Tentar de novo
                </button>
              </div>
            )}

            {lista.length > 0 && (
              <fieldset>
                <legend className="sr-only">Endereço de entrega</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {lista.map((endereco) => (
                    <CardEndereco
                      key={endereco.id}
                      endereco={endereco}
                      selecionado={endereco.id === enderecoId}
                      aoEscolher={setEscolhido}
                    />
                  ))}
                </div>
              </fieldset>
            )}

            {mostrarForm && (
              <div className={lista.length > 0 ? 'mt-6' : ''}>
                {lista.length === 0 && (
                  <p className="mb-4 text-suave">Você ainda não tem endereços salvos. Cadastre o primeiro:</p>
                )}
                <FormEndereco
                  aoSalvar={aoSalvarEndereco}
                  aoCancelar={lista.length > 0 ? () => setFormAberto(false) : undefined}
                />
              </div>
            )}

            {enderecos.status === 'pronto' && !mostrarForm && (
              <button
                type="button"
                onClick={() => setFormAberto(true)}
                className="mt-6 flex items-center gap-2 text-sm font-semibold text-marca hover:text-marca-escura"
              >
                <IconeMais className="h-4 w-4" />
                Adicionar endereço
              </button>
            )}
          </div>

          <ResumoPedido subtotal={subtotal} taxa={taxa}>
            <button
              type="button"
              onClick={confirmar}
              disabled={!enderecoId || carregando || envio.status === 'enviando'}
              className={classeBotaoResumo}
            >
              {envio.status === 'enviando' ? 'Enviando...' : 'Confirmar pedido'}
              {envio.status !== 'enviando' && <IconeSeta className="h-4 w-4" />}
            </button>
            {envio.status === 'erro' && (
              <p role="alert" className="mt-3 rounded-xl bg-erro/8 px-3 py-2.5 text-sm text-erro">
                {envio.mensagem}
              </p>
            )}
            {enderecos.status === 'pronto' && lista.length === 0 && (
              <p className="mt-3 text-center text-xs text-suave">Cadastre um endereço para confirmar.</p>
            )}
          </ResumoPedido>
        </div>
      )}
    </section>
  );
}
