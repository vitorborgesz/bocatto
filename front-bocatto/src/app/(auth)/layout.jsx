import Link from 'next/link';

import Mordida from '@/components/ui/Mordida';

// Layout de login e cadastro: logo no topo e o formulário centralizado, sem o header da loja.
export default function AuthLayout({ children }) {
  return (
    <div className="flex flex-1 flex-col px-4">
      <header className="flex justify-center pt-8">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Bocatto, voltar ao início">
          <Mordida className="h-8 w-8 text-marca" />
          <span className="font-display text-2xl font-extrabold tracking-tight">Bocatto</span>
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center py-12">
        <div className="w-full max-w-[345px]">{children}</div>
      </main>
    </div>
  );
}
