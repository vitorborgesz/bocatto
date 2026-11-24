import Checkout from '@/components/checkout/Checkout';

export const metadata = { title: 'Finalizar pedido' };

// Rota: /checkout — qualquer conta logada (cliente ou admin) pode fazer pedido.
// O login é exigido pelo layout do site ((site)/layout.jsx).
export default function CheckoutPage() {
  return <Checkout />;
}
