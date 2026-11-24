import PedidoConfirmado from '@/components/checkout/PedidoConfirmado';

export const metadata = { title: 'Pedido confirmado' };

// Rota: /pedido-confirmado?pedido=123 — aberta pelo checkout depois de confirmar.
export default async function PedidoConfirmadoPage({ searchParams }) {
  const { pedido } = await searchParams;
  // Só mostra o número se for um número mesmo (o valor vem da URL).
  const numero = /^\d{1,10}$/.test(pedido ?? '') ? pedido : null;

  return <PedidoConfirmado numero={numero} />;
}
