import GerenciarCardapio from '@/components/admin/GerenciarCardapio';

export const metadata = { title: 'Gerenciar cardápio' };

// Rota: /admin/cardapio — produtos e categorias (o layout já exige perfil admin).
export default function AdminCardapioPage() {
  return <GerenciarCardapio />;
}
