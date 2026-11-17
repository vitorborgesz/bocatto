import EmConstrucao from '@/components/ui/EmConstrucao';

export const metadata = { title: 'Carrinho' };

// Rota: /carrinho — dados vêm do CartContext (useCart).
export default function CarrinhoPage() {
  return (
    <EmConstrucao
      titulo="Carrinho"
      descricao="Produtos selecionados, quantidades e subtotal."
      links={[
        { href: '/', rotulo: 'Continuar comprando' },
        { href: '/checkout', rotulo: 'Finalizar pedido' },
      ]}
    />
  );
}
