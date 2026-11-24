import AreaProtegida from '@/components/auth/AreaProtegida';
import HeaderCliente from '@/components/layout/HeaderCliente';

// Área do cliente: o site só abre depois do login (sem login, vai para /login).
// Páginas que exigem perfil cliente (pedidos, checkout) têm uma proteção extra.
export default function ClienteLayout({ children }) {
  return (
    <AreaProtegida>
      <HeaderCliente />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
    </AreaProtegida>
  );
}
