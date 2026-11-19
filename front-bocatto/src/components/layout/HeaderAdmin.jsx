'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import Mordida from '@/components/ui/Mordida';
import { useAuth } from '@/contexts/AuthContext';

const LINKS = [
  { href: '/admin', rotulo: 'Pedidos' },
  { href: '/admin/cardapio', rotulo: 'Cardápio' },
];

// Mesmo desenho do header do cliente, com o selo "Painel" para não confundir as áreas.
export default function HeaderAdmin() {
  const { usuario, logout } = useAuth();
  const caminho = usePathname();

  return (
    <header className="border-b border-borda bg-creme">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/admin" className="flex items-center gap-2 font-display text-xl font-extrabold tracking-tight">
          <Mordida className="h-7 w-7 text-marca" />
          Bocatto
          <span className="rounded-full bg-tinta px-2 py-0.5 font-sans text-[10px] font-bold tracking-[0.12em] text-creme uppercase">
            Painel
          </span>
        </Link>

        <nav className="flex h-full items-center gap-6 text-sm sm:gap-8">
          {LINKS.map(({ href, rotulo }) => {
            const ativo = caminho === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={ativo ? 'page' : undefined}
                className={`flex h-full items-center border-b-2 pt-0.5 transition-colors ${
                  ativo ? 'border-marca' : 'border-transparent text-tinta/80 hover:text-tinta'
                }`}
              >
                {rotulo}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden max-w-40 truncate text-sm text-suave md:block">{usuario?.nome}</span>
          <button
            type="button"
            onClick={logout}
            className="rounded-full border border-borda bg-white px-4 py-2 text-sm font-medium transition-colors hover:border-tinta"
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}
