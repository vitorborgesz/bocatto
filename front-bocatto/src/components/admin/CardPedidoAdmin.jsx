'use client';

import { useState } from 'react';

import { BadgeStatus } from '@/components/pedidos/statusPedido';
import { IconePin } from '@/components/ui/Icones';
import { mensagemDeErro } from '@/services/api';
import { alterarStatusPedido } from '@/services/pedidoService';
import { formatarCep, formatarDataPedido, formatarMoeda } from '@/utils/formatadores';

// Próximo passo de cada status (o mesmo fluxo que a API aceita).
const PROXIMO_PASSO = {
  pendente: { status: 'em_preparo', rotulo: 'Começar preparo' },
  em_preparo: { status: 'saiu_para_entrega', rotulo: 'Saiu para entrega' },
  saiu_para_entrega: { status: 'entregue', rotulo: 'Marcar como entregue' },
};
const PODE_CANCELAR = ['pendente', 'em_preparo'];

// "agora", "há 12 min", "há 2 h": quanto tempo o pedido está esperando.
function tempoDesde(data) {
  const minutos = Math.floor((Date.now() - new Date(data).getTime()) / 60_000);
  if (minutos < 1) return 'agora';
  if (minutos < 60) return `há ${minutos} min`;
  return `há ${Math.floor(minutos / 60)} h`;
}

// Card de um pedido no painel: cliente, itens, endereço, total e o botão do próximo passo.
export default function CardPedidoAdmin({ pedido, aoAtualizar }) {
  const [enviando, setEnviando] = useState(false);
  const [confirmandoCancelamento, setConfirmandoCancelamento] = useState(false);
  const [erro, setErro] = useState(null);

  const proximo = PROXIMO_PASSO[pedido.status];
  const emAndamento = Boolean(proximo);
  const endereco = [
    `${pedido.endereco_rua}, ${pedido.endereco_numero}`,
    pedido.endereco_complemento,
    pedido.endereco_bairro,
    `${pedido.endereco_cidade} · CEP ${formatarCep(pedido.endereco_cep)}`,
  ]
    .filter(Boolean)
    .join(' · ');

  const mudarPara = async (status) => {
    setEnviando(true);
    setErro(null);
    try {
      const atualizado = await alterarStatusPedido(pedido.id, status);
      // A resposta não traz o cliente: mantém o que já estava na tela.
      aoAtualizar({ ...atualizado, cliente: pedido.cliente });
      setConfirmandoCancelamento(false);
    } catch (e) {
      setErro(mensagemDeErro(e, 'Não foi possível atualizar o pedido.'));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <article
      className={`flex flex-col rounded-2xl border bg-white p-5 ${
        pedido.status === 'pendente' ? 'border-marca shadow-[0_6px_24px_-14px_rgba(232,89,12,0.5)]' : 'border-borda'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <BadgeStatus status={pedido.status} />
        <span className="text-xs text-suave tabular-nums">
          {emAndamento ? tempoDesde(pedido.criado_em) : formatarDataPedido(pedido.criado_em)}
        </span>
      </div>

      <h2 className="mt-3 font-display text-lg leading-tight font-bold">Pedido #{pedido.id}</h2>
      <p className="mt-0.5 truncate text-sm text-suave">
        {pedido.cliente?.nome ?? 'Cliente'}
        {pedido.cliente?.email && ` · ${pedido.cliente.email}`}
      </p>

      <ul className="mt-4 space-y-1.5 text-sm">
        {pedido.itens.map((item) => (
          <li key={item.id} className="flex justify-between gap-4">
            <span>
              <span className="font-semibold text-marca tabular-nums">{item.quantidade}×</span> {item.nome_produto}
            </span>
            <span className="text-suave tabular-nums">{formatarMoeda(item.preco_unitario * item.quantidade)}</span>
          </li>
        ))}
      </ul>

      <p className="mt-4 flex gap-1.5 text-xs text-suave">
        <IconePin className="mt-px h-3.5 w-3.5 shrink-0" />
        {endereco}
      </p>

      <div className="mt-auto pt-5">
        <div className="flex items-center justify-between gap-3 border-t border-borda pt-4">
          <span className="font-display text-lg font-bold text-marca tabular-nums">{formatarMoeda(pedido.total)}</span>

          {proximo && !confirmandoCancelamento && (
            <button
              type="button"
              onClick={() => mudarPara(proximo.status)}
              disabled={enviando}
              className="h-9 rounded-full bg-marca px-4 text-xs font-semibold text-white transition-colors hover:bg-marca-escura disabled:opacity-60"
            >
              {enviando ? 'Salvando...' : proximo.rotulo}
            </button>
          )}
        </div>

        {PODE_CANCELAR.includes(pedido.status) && (
          <div className="mt-3 text-right text-xs">
            {confirmandoCancelamento ? (
              <span className="inline-flex items-center gap-3">
                <span className="text-suave">Cancelar o pedido #{pedido.id}?</span>
                <button
                  type="button"
                  onClick={() => mudarPara('cancelado')}
                  disabled={enviando}
                  className="font-semibold text-erro underline underline-offset-2 disabled:opacity-50"
                >
                  {enviando ? 'Cancelando...' : 'Sim, cancelar'}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmandoCancelamento(false)}
                  disabled={enviando}
                  className="font-medium underline underline-offset-2"
                >
                  Não
                </button>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmandoCancelamento(true)}
                className="font-medium text-suave underline underline-offset-2 hover:text-erro"
              >
                Cancelar pedido
              </button>
            )}
          </div>
        )}

        {erro && (
          <p role="alert" className="mt-3 rounded-xl bg-erro/8 px-3 py-2 text-xs text-erro">
            {erro}
          </p>
        )}
      </div>
    </article>
  );
}
