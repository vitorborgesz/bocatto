import MeusPedidos from '@/components/pedidos/MeusPedidos';

export const metadata = { title: 'Meus pedidos' };

// Rota: /pedidos — pedidos PESSOAIS de quem está logado (cliente ou admin).
// O login é exigido pelo layout do site ((site)/layout.jsx). A gestão de todos os pedidos fica em /admin.
export default function PedidosPage() {
  return <MeusPedidos />;
}
