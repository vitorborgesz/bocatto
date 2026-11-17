import EmConstrucao from '@/components/ui/EmConstrucao';

export const metadata = { title: 'Restaurante' };

// Rota: /restaurantes/:id — no Next 16, `params` é uma Promise.
export default async function RestaurantePage({ params }) {
  const { id } = await params;

  return (
    <EmConstrucao
      titulo={`Restaurante #${id}`}
      descricao="Dados do restaurante e cardápio, com o botão de adicionar ao carrinho."
      links={[
        { href: '/', rotulo: 'Voltar aos restaurantes' },
        { href: '/carrinho', rotulo: 'Ir para o carrinho' },
      ]}
    />
  );
}
