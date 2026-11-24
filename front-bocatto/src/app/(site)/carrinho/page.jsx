import Carrinho from '@/components/carrinho/Carrinho';

export const metadata = { title: 'Carrinho' };

// Rota: /carrinho — aberta a todos; o login só é pedido ao continuar para o checkout.
export default function CarrinhoPage() {
  return <Carrinho />;
}
