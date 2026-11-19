import PainelPedidos from '@/components/admin/PainelPedidos';

export const metadata = { title: 'Pedidos recebidos' };

// Rota: /admin — fila de pedidos da cozinha (o layout já exige perfil admin).
export default function AdminPedidosPage() {
  return <PainelPedidos />;
}
