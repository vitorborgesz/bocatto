import { formatarMoeda } from '@/utils/formatadores';

// Card "Resumo" do carrinho e do checkout. O botão de ação vem em `children`.
// taxa: "5.00" | undefined (carregando) | null (não foi possível buscar).
export default function ResumoPedido({ subtotal, taxa, children }) {
  // Em centavos para não somar floats.
  const total = taxa ? (Math.round(subtotal * 100) + Math.round(Number(taxa) * 100)) / 100 : subtotal;

  return (
    <aside className="rounded-2xl border border-borda bg-white p-6 sm:p-7 lg:sticky lg:top-8">
      <h2 className="font-display text-2xl font-bold">Resumo</h2>

      <dl className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt>Subtotal</dt>
          <dd className="font-semibold tabular-nums">{formatarMoeda(subtotal)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>Taxa de entrega</dt>
          <dd className="font-semibold tabular-nums">
            {taxa === undefined && <span className="inline-block h-4 w-14 animate-pulse rounded bg-borda align-middle" />}
            {taxa === null && '—'}
            {taxa && formatarMoeda(taxa)}
          </dd>
        </div>
      </dl>

      <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-borda pt-5">
        <span>Total</span>
        <span className="font-display text-2xl font-bold text-marca tabular-nums">{formatarMoeda(total)}</span>
      </div>
      {taxa === null && <p className="mt-1 text-right text-xs text-suave">Sem a taxa de entrega, confirmada ao finalizar.</p>}

      <div className="mt-6">{children}</div>
    </aside>
  );
}

// Estilo do botão principal do resumo (Link ou button).
export const classeBotaoResumo =
  'flex h-11 w-full items-center justify-center gap-2 rounded-full bg-marca text-sm font-semibold text-white transition-colors hover:bg-marca-escura focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-marca';
