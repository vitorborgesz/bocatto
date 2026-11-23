'use client';

import { useState } from 'react';

import { BotaoDetalhes } from '@/components/pedidos/AcoesPedido';
import DetalhesPedido from '@/components/pedidos/DetalhesPedido';
import { BadgeStatus } from '@/components/pedidos/statusPedido';
import { formatarDataPedido, formatarMoeda } from '@/utils/formatadores';

// Item do histórico (entregue ou cancelado): status, número, data e total.
export default function LinhaPedido({ pedido }) {
  const [aberto, setAberto] = useState(false);

  return (
    <li className="border-b border-borda px-1 py-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <BadgeStatus status={pedido.status} />
          <h3 className="mt-2.5 font-display text-[15px] font-bold">Pedido #{pedido.id}</h3>
          <p className="mt-0.5 text-sm text-suave tabular-nums">
            {formatarDataPedido(pedido.criado_em)} · {formatarMoeda(pedido.total)}
          </p>
        </div>

        <div className="self-center">
          <BotaoDetalhes aberto={aberto} aoAlternar={() => setAberto((v) => !v)} />
        </div>
      </div>
      {aberto && <DetalhesPedido pedido={pedido} />}
    </li>
  );
}
