'use client';

import { useEffect, useRef } from 'react';

import { IconeMais } from '@/components/ui/Icones';

// Janela modal com o <dialog> nativo: fecha no Esc, no X e clicando fora.
// O conteúdo só é montado enquanto está aberta (formulários começam do zero).
export default function Modal({ aberto, aoFechar, titulo, children }) {
  const dialogo = useRef(null);

  useEffect(() => {
    const elemento = dialogo.current;
    if (aberto && !elemento.open) elemento.showModal();
    if (!aberto && elemento.open) elemento.close();
  }, [aberto]);

  return (
    <dialog
      ref={dialogo}
      onClose={aoFechar}
      // O próprio <dialog> só recebe o clique quando ele acontece no fundo escurecido.
      onClick={(evento) => evento.target === dialogo.current && aoFechar()}
      className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-3xl border border-borda bg-creme p-0 text-tinta backdrop:bg-tinta/40"
    >
      {aberto && (
        <div className="p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <h2 className="font-display text-2xl font-bold">{titulo}</h2>
            <button
              type="button"
              onClick={aoFechar}
              aria-label="Fechar"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-borda bg-white transition-colors hover:border-tinta"
            >
              <IconeMais className="h-4 w-4 rotate-45" />
            </button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  );
}
