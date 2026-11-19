// Rótulo e cores de cada status (os valores vêm de STATUS_PEDIDO na API).
export const STATUS = {
  pendente: { rotulo: 'Pendente', cor: 'bg-amber-100 text-amber-800' },
  em_preparo: { rotulo: 'Em preparo', cor: 'bg-marca-clara text-marca' },
  saiu_para_entrega: { rotulo: 'Saiu para entrega', cor: 'bg-marca-clara text-marca' },
  entregue: { rotulo: 'Entregue', cor: 'bg-green-100 text-sucesso' },
  cancelado: { rotulo: 'Cancelado', cor: 'bg-zinc-200/70 text-zinc-600' },
};

// Etapas mostradas na linha de progresso, na ordem do fluxo.
export const ETAPAS = [
  { status: 'pendente', rotulo: 'Recebido' },
  { status: 'em_preparo', rotulo: 'Em preparo' },
  { status: 'saiu_para_entrega', rotulo: 'Saiu para entrega' },
  { status: 'entregue', rotulo: 'Entregue' },
];

export const EM_ANDAMENTO = ['pendente', 'em_preparo', 'saiu_para_entrega'];

export function BadgeStatus({ status }) {
  const { rotulo, cor } = STATUS[status] ?? { rotulo: status, cor: 'bg-zinc-100 text-zinc-600' };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${cor}`}>{rotulo}</span>
  );
}
