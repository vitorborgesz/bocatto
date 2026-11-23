import Link from 'next/link';

import Mordida from '@/components/ui/Mordida';

// Página 404, para qualquer endereço que não existe.
export default function NaoEncontrada() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <Mordida className="h-16 w-16 text-marca" />
      <p className="mt-6 text-xs font-bold tracking-[0.14em] text-marca uppercase">Erro 404</p>
      <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
        Essa página já foi comida.
      </h1>
      <p className="mt-3 max-w-sm text-suave">O endereço não existe ou mudou de lugar.</p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-marca px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-marca-escura"
      >
        Voltar ao cardápio
      </Link>
    </main>
  );
}
