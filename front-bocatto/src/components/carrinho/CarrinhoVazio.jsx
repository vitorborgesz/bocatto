import Link from 'next/link';

import Mordida from '@/components/ui/Mordida';

export default function CarrinhoVazio() {
  return (
    <div className="mt-10 flex flex-col items-center rounded-3xl border border-borda bg-white px-6 py-14 text-center">
      <Mordida className="h-12 w-12 text-marca" />
      <p className="mt-5 font-display text-2xl font-bold">Seu carrinho está vazio.</p>
      <p className="mt-1 text-suave">A fome não espera: escolha algo no cardápio.</p>
      <Link
        href="/cardapio"
        className="mt-6 rounded-full bg-marca px-6 py-3 text-sm font-semibold text-white hover:bg-marca-escura"
      >
        Ver cardápio
      </Link>
    </div>
  );
}
