'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { IconeSacola, IconeUsuario } from '@/components/ui/Icones';
import Mordida from '@/components/ui/Mordida';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

// A tela inicial (/) também é o cardápio.
const LINKS = [
  { href: '/cardapio', rotulo: 'Cardápio', ativos: ['/', '/cardapio'] },
  { href: '/pedidos', rotulo: 'Meus pedidos', ativos: ['/pedidos'] },
];
const LINK_PAINEL = { href: '/admin', rotulo: 'Painel', ativos: ['/admin'] };

const botaoRedondo =
  'relative flex h-10 w-10 items-center justify-center rounded-full border border-borda bg-white transition-colors hover:border-tinta';

// Header do site, igual para todos. O admin vê também o link "Painel".
export default function Header() {
  const caminho = usePathname();
  const { quantidadeTotal } = useCart();
  const { usuario } = useAuth();
  // O admin vê também o atalho para o painel de gestão.
  const links = usuario?.perfil === 'admin' ? [...LINKS, LINK_PAINEL] : LINKS;

  return (
    <header className="border-b border-borda bg-creme">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-extrabold tracking-tight">
          <Mordida className="h-7 w-7 text-marca" />
          Bocatto
        </Link>

        <nav className="hidden h-full items-center gap-8 text-sm sm:flex">
          {links.map(({ href, rotulo, ativos }) => {
            const ativo = ativos.includes(caminho);
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

        <div className="flex items-center gap-2">
          <MenuUsuario />
          <Link href="/carrinho" aria-label={`Carrinho, ${quantidadeTotal} itens`} className={botaoRedondo}>
            <IconeSacola className="h-[18px] w-[18px]" />
            {quantidadeTotal > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-creme bg-marca px-1 text-[10px] font-bold text-white tabular-nums">
                {quantidadeTotal > 99 ? '99+' : quantidadeTotal}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}

// Sem login: leva para /login. Logado: menu curto com pedidos, painel (admin) e sair.
function MenuUsuario() {
  const { usuario, logout } = useAuth();
  const [aberto, setAberto] = useState(false);
  const caixa = useRef(null);

  useEffect(() => {
    if (!aberto) return undefined;
    const fecharSeFora = (evento) => {
      if (!caixa.current?.contains(evento.target)) setAberto(false);
    };
    document.addEventListener('mousedown', fecharSeFora);
    return () => document.removeEventListener('mousedown', fecharSeFora);
  }, [aberto]);

  if (!usuario) {
    return (
      <Link href="/login" aria-label="Entrar" className={botaoRedondo}>
        <IconeUsuario className="h-[18px] w-[18px]" />
      </Link>
    );
  }

  const fechar = () => setAberto(false);
  const item = 'block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-creme';

  return (
    <div ref={caixa} className="relative">
      <button
        type="button"
        aria-label="Minha conta"
        aria-expanded={aberto}
        onClick={() => setAberto((valor) => !valor)}
        className={botaoRedondo}
      >
        <IconeUsuario className="h-[18px] w-[18px]" />
      </button>

      {aberto && (
        <div className="absolute right-0 z-20 mt-2 w-52 rounded-2xl border border-borda bg-white p-2 shadow-sm">
          <p className="truncate px-3 pt-1 pb-2 text-xs text-suave">Olá, {usuario.nome}</p>
          <Link href="/pedidos" onClick={fechar} className={item}>
            Meus pedidos
          </Link>
          {usuario.perfil === 'admin' && (
            <Link href="/admin" onClick={fechar} className={item}>
              Painel
            </Link>
          )}
          <button
            type="button"
            onClick={() => {
              fechar();
              logout();
            }}
            className={`${item} text-suave`}
          >
            Sair
          </button>
        </div>
      )}
    </div>
  );
}
