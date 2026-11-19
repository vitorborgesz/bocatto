import Cardapio from '@/components/cardapio/Cardapio';

export const metadata = { title: 'Cardápio' };

// Rota: /cardapio — produtos ativos (GET /produtos) filtrados por categoria (GET /categorias).
export default function CardapioPage() {
  return <Cardapio />;
}
