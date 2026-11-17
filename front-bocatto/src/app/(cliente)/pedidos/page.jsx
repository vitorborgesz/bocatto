import AreaProtegida from '@/components/auth/AreaProtegida';
import EmConstrucao from '@/components/ui/EmConstrucao';

export const metadata = { title: 'Meus pedidos' };

// Rota: /pedidos — exige login de cliente.
export default function PedidosPage() {
  return (
    <AreaProtegida perfil="cliente">
      <EmConstrucao
        titulo="Meus pedidos"
        descricao="Histórico de pedidos e acompanhamento do status."
        links={[{ href: '/', rotulo: 'Fazer um novo pedido' }]}
      />
    </AreaProtegida>
  );
}
