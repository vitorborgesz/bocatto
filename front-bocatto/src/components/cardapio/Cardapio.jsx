'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import CardProduto from '@/components/cardapio/CardProduto';
import { useCart } from '@/contexts/CartContext';
import { mensagemDeErro } from '@/services/api';
import { listarCategorias, listarProdutos } from '@/services/cardapioService';
import { formatarMoeda } from '@/utils/formatadores';

// Cardápio público (tela inicial e /cardapio): chips de categoria + produtos ativos.
export default function Cardapio() {
  const [dados, setDados] = useState({ status: 'carregando' });
  const [tentativa, setTentativa] = useState(0);
  const [categoriaEscolhida, setCategoriaEscolhida] = useState(null);

  useEffect(() => {
    let ativo = true;
    Promise.all([listarCategorias(), listarProdutos()])
      .then(([categorias, produtos]) => {
        if (!ativo) return;
        // Só mostra categorias que têm algum produto disponível.
        const comProdutos = categorias.filter((c) => produtos.some((p) => p.categoria_id === c.id));
        setDados({ status: 'pronto', categorias: comProdutos, produtos });
      })
      .catch((erro) => {
        if (ativo) setDados({ status: 'erro', mensagem: mensagemDeErro(erro, 'Não foi possível carregar o cardápio.') });
      });
    return () => {
      ativo = false;
    };
  }, [tentativa]);

  const tentarDeNovo = () => {
    setDados({ status: 'carregando' });
    setTentativa((valor) => valor + 1);
  };

  return (
    <section className="pt-6 pb-24 sm:pt-12 sm:pb-12">
      <p className="text-xs font-bold tracking-[0.14em] text-marca uppercase">Escolha sem pressa</p>
      <h1 className="mt-3 font-display text-5xl font-extrabold tracking-tight sm:text-6xl">Cardápio</h1>
      <p className="mt-3 text-suave">Tem coisa boa em todas as direções.</p>

      {dados.status === 'carregando' && <Esqueleto />}

      {dados.status === 'erro' && (
        <div className="mt-10 rounded-2xl border border-borda bg-white p-8 text-center">
          <p className="font-display text-xl font-bold">Ops, a cozinha não respondeu.</p>
          <p className="mt-1 text-sm text-suave">{dados.mensagem}</p>
          <button
            type="button"
            onClick={tentarDeNovo}
            className="mt-5 rounded-full bg-marca px-5 py-2.5 text-sm font-semibold text-white hover:bg-marca-escura"
          >
            Tentar de novo
          </button>
        </div>
      )}

      {dados.status === 'pronto' && dados.categorias.length === 0 && (
        <p className="mt-10 rounded-2xl border border-borda bg-white p-8 text-center text-suave">
          O cardápio está sendo preparado. Volte daqui a pouco!
        </p>
      )}

      {dados.status === 'pronto' && dados.categorias.length > 0 && (
        <ListaPorCategoria
          categorias={dados.categorias}
          produtos={dados.produtos}
          categoriaId={categoriaEscolhida ?? dados.categorias[0].id}
          aoEscolher={setCategoriaEscolhida}
        />
      )}

      <BarraCarrinho />
    </section>
  );
}

function ListaPorCategoria({ categorias, produtos, categoriaId, aoEscolher }) {
  const categoria = categorias.find((c) => c.id === categoriaId) ?? categorias[0];
  const visiveis = produtos.filter((p) => p.categoria_id === categoria.id);
  // A "mordida" aparece uma vez só: no primeiro card sem foto.
  const primeiroSemFoto = visiveis.find((p) => !p.imagem_url)?.id;

  return (
    <>
      <div className="-mx-4 mt-10 overflow-x-auto px-4 [scrollbar-width:none]">
        <div role="tablist" className="inline-flex gap-2 rounded-full border border-borda bg-creme p-1.5">
          {categorias.map((c) => {
            const ativa = c.id === categoria.id;
            return (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={ativa}
                onClick={() => aoEscolher(c.id)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors ${
                  ativa
                    ? 'border-marca-clara bg-marca-clara text-marca'
                    : 'border-borda bg-white text-tinta hover:border-tinta/40'
                }`}
              >
                {c.nome}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {visiveis.map((produto) => (
          <CardProduto
            key={produto.id}
            produto={produto}
            inicial={categoria.nome.charAt(0)}
            comMordida={produto.id === primeiroSemFoto}
          />
        ))}
      </div>
    </>
  );
}

// No celular, atalho fixo para o carrinho quando há itens.
function BarraCarrinho() {
  const { quantidadeTotal, subtotal } = useCart();
  if (quantidadeTotal === 0) return null;

  return (
    <Link
      href="/carrinho"
      className="fixed inset-x-4 bottom-4 z-10 flex items-center justify-between rounded-full bg-marca px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-marca/25 sm:hidden"
    >
      <span>Ver carrinho</span>
      <span className="tabular-nums">
        {quantidadeTotal} {quantidadeTotal === 1 ? 'item' : 'itens'} · {formatarMoeda(subtotal)}
      </span>
    </Link>
  );
}

function Esqueleto() {
  return (
    <div aria-hidden="true" className="animate-pulse">
      <div className="mt-10 h-14 w-full max-w-md rounded-full bg-borda/60" />
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="flex h-40 overflow-hidden rounded-2xl border border-borda bg-white">
            <div className="w-28 bg-marca-clara/60 sm:w-[135px]" />
            <div className="flex-1 space-y-3 p-5">
              <div className="h-5 w-1/2 rounded bg-borda" />
              <div className="h-3 w-5/6 rounded bg-borda/70" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
