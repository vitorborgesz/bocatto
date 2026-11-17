'use client';

import Link from 'next/link';

import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

export default function HeaderCliente() {
  const { usuario, logout } = useAuth();
  const { quantidadeTotal } = useCart();

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-marca">
          Bocatto
        </Link>

        <nav className="flex items-center gap-5 text-sm font-medium">
          {usuario?.perfil === 'restaurante' && <Link href="/restaurante">Painel</Link>}
          {usuario && <Link href="/pedidos">Meus pedidos</Link>}
          <Link href="/carrinho">Carrinho ({quantidadeTotal})</Link>
          {usuario ? (
            <button type="button" onClick={logout} className="text-zinc-500 hover:text-zinc-900">
              Sair
            </button>
          ) : (
            <Link href="/login" className="rounded-lg bg-marca px-4 py-2 text-white hover:bg-marca-escura">
              Entrar
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
