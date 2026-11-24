import AreaProtegida from '@/components/auth/AreaProtegida';
import Checkout from '@/components/checkout/Checkout';

export const metadata = { title: 'Finalizar pedido' };

// Rota: /checkout — exige login de cliente (sem login, vai para /login e volta para cá).
export default function CheckoutPage() {
  return (
    <AreaProtegida perfil="cliente">
      <Checkout />
    </AreaProtegida>
  );
}
