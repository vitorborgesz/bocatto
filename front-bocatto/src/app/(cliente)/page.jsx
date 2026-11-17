import EmConstrucao from '@/components/ui/EmConstrucao';

// Rota: /
export default function InicioPage() {
  return (
    <EmConstrucao
      titulo="Bocatto"
      descricao="Apresentação do restaurante, destaques do cardápio e acesso ao pedido."
      links={[
        { href: '/cardapio', rotulo: 'Ver cardápio' },
        { href: '/carrinho', rotulo: 'Carrinho' },
        { href: '/login', rotulo: 'Login' },
        { href: '/admin', rotulo: 'Painel do admin' },
      ]}
    />
  );
}
