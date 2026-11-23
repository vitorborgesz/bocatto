'use client';

import { useState } from 'react';

import { BotaoDetalhes, CancelarPedido } from '@/components/pedidos/AcoesPedido';
import DetalhesPedido from '@/components/pedidos/DetalhesPedido';
import { BadgeStatus, ETAPAS } from '@/components/pedidos/statusPedido';
import { IconeCheck, IconeRelogio } from '@/components/ui/Icones';
import { formatarDataPedido, formatarMoeda } from '@/utils/formatadores';

// Card de um pedido que ainda não foi concluído: etapa atual na linha de progresso,
// detalhes e o botão de cancelar (enquanto pendente).
export default function PedidoEmAndamento({ pedido, aoAtualizar }) {
  const [aberto, setAberto] = useState(false);

  return (
    <article className="rounded-3xl border border-borda bg-white p-6 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <BadgeStatus status={pedido.status} />
          <h2 className="mt-3 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
            Pedido #{pedido.id}
          </h2>
          <p className="mt-2 text-sm text-suave tabular-nums">
            {formatarDataPedido(pedido.criado_em)} · {formatarMoeda(pedido.total)}
          </p>
        </div>
        <IconeRelogio className="h-6 w-6 shrink-0 text-tinta" />
      </div>

      <Progresso status={pedido.status} />

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <BotaoDetalhes aberto={aberto} aoAlternar={() => setAberto((v) => !v)} />
        <CancelarPedido pedido={pedido} aoCancelar={aoAtualizar} />
      </div>
      {aberto && <DetalhesPedido pedido={pedido} />}
    </article>
  );
}

// Etapas concluídas ficam laranja. A linha entre duas etapas só fica laranja quando
// o pedido já chegou na etapa seguinte (ex.: "Saiu para entrega" não pinta até "Entregue").
function Progresso({ status }) {
  const atual = ETAPAS.findIndex((etapa) => etapa.status === status);

  return (
    <ol className="mt-8 grid grid-cols-4">
      {ETAPAS.map((etapa, i) => {
        const feita = i <= atual;
        const ultima = i === ETAPAS.length - 1;
        return (
          <li key={etapa.status} className="relative" aria-current={i === atual ? 'step' : undefined}>
            {!ultima && (
              <span
                aria-hidden="true"
                className={`absolute top-1.75 right-0 left-4 h-0.5 ${i < atual ? 'bg-marca' : 'bg-borda'}`}
              />
            )}
            <span
              className={`relative flex h-4 w-4 items-center justify-center rounded-full border ${
                feita ? 'border-marca bg-marca text-white' : 'border-borda bg-white'
              }`}
            >
              {feita && <IconeCheck className="h-2.5 w-2.5" />}
            </span>
            <span className={`mt-2 block pr-2 text-[11px] font-semibold sm:text-xs ${feita ? '' : 'text-suave'}`}>
              {etapa.rotulo}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
