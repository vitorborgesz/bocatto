import AreaProtegida from '@/components/auth/AreaProtegida';
import HeaderAdmin from '@/components/layout/HeaderAdmin';

// Área administrativa: todas as páginas exigem login com perfil "admin".
export default function AdminLayout({ children }) {
  return (
    <AreaProtegida perfil="admin">
      <HeaderAdmin />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
    </AreaProtegida>
  );
}
