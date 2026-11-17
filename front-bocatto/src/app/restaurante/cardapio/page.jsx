import EmConstrucao from '@/components/ui/EmConstrucao';

export const metadata = { title: 'Cardápio' };

// Rota: /restaurante/cardapio
export default function CardapioPage() {
  return (
    <EmConstrucao
      titulo="Cardápio"
      descricao="Cadastrar, editar e desativar produtos e ajustar o estoque."
      links={[{ href: '/restaurante', rotulo: 'Ver pedidos' }]}
    />
  );
}
