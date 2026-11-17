import AreaProtegida from '@/components/auth/AreaProtegida';
import HeaderRestaurante from '@/components/layout/HeaderRestaurante';

// Área do restaurante: todas as páginas exigem login com perfil "restaurante".
export default function RestauranteLayout({ children }) {
  return (
    <AreaProtegida perfil="restaurante">
      <HeaderRestaurante />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
    </AreaProtegida>
  );
}
