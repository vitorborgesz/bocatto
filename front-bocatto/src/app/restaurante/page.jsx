import EmConstrucao from '@/components/ui/EmConstrucao';

export const metadata = { title: 'Pedidos recebidos' };

// Rota: /restaurante
export default function PainelRestaurantePage() {
  return (
    <EmConstrucao
      titulo="Pedidos recebidos"
      descricao="Pedidos do restaurante, com o botão para avançar o status."
      links={[{ href: '/restaurante/cardapio', rotulo: 'Gerenciar cardápio' }]}
    />
  );
}
