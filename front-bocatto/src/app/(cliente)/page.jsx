import EmConstrucao from '@/components/ui/EmConstrucao';

// Rota: /
export default function InicioPage() {
  return (
    <EmConstrucao
      titulo="Restaurantes"
      descricao="Busca, filtro por categoria e lista de restaurantes."
      links={[
        { href: '/restaurantes/1', rotulo: 'Ver um restaurante' },
        { href: '/carrinho', rotulo: 'Carrinho' },
        { href: '/login', rotulo: 'Login' },
        { href: '/restaurante', rotulo: 'Painel do restaurante' },
      ]}
    />
  );
}
