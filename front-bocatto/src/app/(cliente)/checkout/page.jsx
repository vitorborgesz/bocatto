import AreaProtegida from '@/components/auth/AreaProtegida';
import EmConstrucao from '@/components/ui/EmConstrucao';

export const metadata = { title: 'Finalizar pedido' };

// Rota: /checkout — exige login de cliente.
export default function CheckoutPage() {
  return (
    <AreaProtegida perfil="cliente">
      <EmConstrucao
        titulo="Finalizar pedido"
        descricao="Escolher ou cadastrar o endereço, revisar os valores (com a taxa de entrega) e confirmar o pedido."
        links={[
          { href: '/carrinho', rotulo: 'Voltar ao carrinho' },
          { href: '/pedidos', rotulo: 'Meus pedidos' },
        ]}
      />
    </AreaProtegida>
  );
}
