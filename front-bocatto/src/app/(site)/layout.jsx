import AreaProtegida from '@/components/auth/AreaProtegida';
import Header from '@/components/layout/Header';

// Layout único do site: as mesmas páginas e o mesmo header para cliente e admin.
// Só abre depois do login (sem login, vai para /login).
// A única página exclusiva do admin é /admin, protegida na própria página.
export default function SiteLayout({ children }) {
  return (
    <AreaProtegida>
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
    </AreaProtegida>
  );
}
