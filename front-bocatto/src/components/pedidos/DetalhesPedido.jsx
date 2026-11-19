import { formatarMoeda } from '@/utils/formatadores';

// Itens, endereço de entrega e valores do pedido (cópias gravadas na hora da compra).
export default function DetalhesPedido({ pedido }) {
  const endereco = [
    `${pedido.endereco_rua}, ${pedido.endereco_numero}`,
    pedido.endereco_complemento,
    pedido.endereco_bairro,
    pedido.endereco_cidade,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <div className="mt-4 grid gap-6 rounded-2xl bg-white/70 p-5 text-sm sm:grid-cols-[1fr_auto]">
      <div>
        <ul className="space-y-1.5">
          {pedido.itens.map((item) => (
            <li key={item.id} className="flex justify-between gap-4">
              <span>
                <span className="text-suave tabular-nums">{item.quantidade}×</span> {item.nome_produto}
              </span>
              <span className="tabular-nums">{formatarMoeda(item.preco_unitario * item.quantidade)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-suave">Entrega em {endereco}</p>
      </div>

      <dl className="space-y-1 border-t border-borda pt-4 tabular-nums sm:min-w-48 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6">
        <div className="flex justify-between gap-6 text-suave">
          <dt>Subtotal</dt>
          <dd>{formatarMoeda(pedido.subtotal)}</dd>
        </div>
        <div className="flex justify-between gap-6 text-suave">
          <dt>Entrega</dt>
          <dd>{formatarMoeda(pedido.taxa_entrega)}</dd>
        </div>
        <div className="flex justify-between gap-6 pt-1 font-semibold">
          <dt>Total</dt>
          <dd>{formatarMoeda(pedido.total)}</dd>
        </div>
      </dl>
    </div>
  );
}
