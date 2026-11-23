'use client';

import Link from 'next/link';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { IconeCheck } from '@/components/ui/Icones';

const AvisoContext = createContext(null);

// Quanto tempo o aviso fica na tela.
const DURACAO_MS = 3500;

// Aviso rápido no rodapé da tela ("toast"). Um por vez: um aviso novo substitui o anterior.
// Uso: const avisar = useAviso(); avisar({ titulo, texto, acao: { href, rotulo } })
export function AvisoProvider({ children }) {
  const [aviso, setAviso] = useState(null);

  useEffect(() => {
    if (!aviso) return undefined;
    const timer = setTimeout(() => setAviso(null), DURACAO_MS);
    return () => clearTimeout(timer);
  }, [aviso]);

  // O id muda a cada aviso: reinicia o tempo e a animação mesmo com o mesmo texto.
  const avisar = useCallback((dados) => setAviso({ ...dados, id: Date.now() }), []);
  const fechar = () => setAviso(null);

  return (
    <AvisoContext.Provider value={avisar}>
      {children}

      {/* bottom-20 no celular: fica acima da barra "Ver carrinho" do cardápio. */}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-20 z-50 flex justify-center px-4 sm:bottom-6">
        {aviso && (
          <div
            key={aviso.id}
            role="status"
            className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl bg-tinta py-3 pr-3 pl-4 text-creme shadow-lg shadow-tinta/20 motion-safe:animate-aviso"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-marca text-white">
              <IconeCheck className="h-3.5 w-3.5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{aviso.titulo}</p>
              {aviso.texto && <p className="truncate text-xs text-creme/70">{aviso.texto}</p>}
            </div>
            {aviso.acao && (
              <Link
                href={aviso.acao.href}
                onClick={fechar}
                className="shrink-0 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-white/20"
              >
                {aviso.acao.rotulo}
              </Link>
            )}
          </div>
        )}
      </div>
    </AvisoContext.Provider>
  );
}

export function useAviso() {
  const contexto = useContext(AvisoContext);
  if (!contexto) throw new Error('useAviso deve ser usado dentro de <AvisoProvider>');
  return contexto;
}
