import EmConstrucao from '@/components/ui/EmConstrucao';

export const metadata = { title: 'Pedidos recebidos' };

// Rota: /admin
export default function AdminPedidosPage() {
  return (
    <EmConstrucao
      titulo="Pedidos recebidos"
      descricao="Lista de pedidos com filtro por status, botão para avançar o status e cancelar."
      links={[{ href: '/admin/cardapio', rotulo: 'Gerenciar cardápio' }]}
    />
  );
}
