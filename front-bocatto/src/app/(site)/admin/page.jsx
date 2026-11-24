import PainelPedidos from '@/components/admin/PainelPedidos';
import AreaProtegida from '@/components/auth/AreaProtegida';

export const metadata = { title: 'Painel' };

// Rota: /admin — única página exclusiva do admin: gestão dos pedidos de todos os clientes.
// Cliente que abrir este endereço vai para o início (e a API recusa os dados com 403).
export default function PainelPage() {
  return (
    <AreaProtegida perfil="admin">
      <PainelPedidos />
    </AreaProtegida>
  );
}
