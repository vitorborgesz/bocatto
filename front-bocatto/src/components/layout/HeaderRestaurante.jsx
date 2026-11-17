'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useAuth } from '@/contexts/AuthContext';

const LINKS = [
  { href: '/restaurante', rotulo: 'Pedidos' },
  { href: '/restaurante/cardapio', rotulo: 'Cardápio' },
];

export default function HeaderRestaurante() {
  const { usuario, logout } = useAuth();
  const caminho = usePathname();

  return (
    <header className="border-b border-zinc-800 bg-zinc-900 text-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Link href="/restaurante" className="text-xl font-bold text-marca">
            Bocatto
          </Link>
          <span className="text-sm text-zinc-400">Painel · {usuario?.nome}</span>
        </div>

        <nav className="flex items-center gap-5 text-sm font-medium">
          {LINKS.map(({ href, rotulo }) => (
            <Link key={href} href={href} className={caminho === href ? 'text-marca' : 'hover:text-zinc-300'}>
              {rotulo}
            </Link>
          ))}
          <button type="button" onClick={logout} className="text-zinc-400 hover:text-white">
            Sair
          </button>
        </nav>
      </div>
    </header>
  );
}
