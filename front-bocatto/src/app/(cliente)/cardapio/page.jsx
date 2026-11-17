import EmConstrucao from '@/components/ui/EmConstrucao';

export const metadata = { title: 'Cardápio' };

// Rota: /cardapio — produtos ativos (GET /produtos) agrupados por categoria (GET /categorias).
export default function CardapioPage() {
  return (
    <EmConstrucao
      titulo="Cardápio"
      descricao="Produtos organizados por categoria, com o botão de adicionar ao carrinho."
      links={[
        { href: '/', rotulo: 'Voltar ao início' },
        { href: '/carrinho', rotulo: 'Ir para o carrinho' },
      ]}
    />
  );
}
