import EmConstrucao from '@/components/ui/EmConstrucao';

export const metadata = { title: 'Gerenciar cardápio' };

// Rota: /admin/cardapio
export default function AdminCardapioPage() {
  return (
    <EmConstrucao
      titulo="Gerenciar cardápio"
      descricao="Cadastrar e editar produtos e categorias, e disponibilizar ou indisponibilizar produtos."
      links={[{ href: '/admin', rotulo: 'Ver pedidos' }]}
    />
  );
}
