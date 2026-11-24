import AreaProtegida from '@/components/auth/AreaProtegida';
import MeusPedidos from '@/components/pedidos/MeusPedidos';

export const metadata = { title: 'Meus pedidos' };

// Rota: /pedidos — exige login de cliente.
export default function PedidosPage() {
  return (
    <AreaProtegida perfil="cliente">
      <MeusPedidos />
    </AreaProtegida>
  );
}
