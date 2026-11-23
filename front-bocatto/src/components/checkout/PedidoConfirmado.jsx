import Link from 'next/link';

import { IconeSeta } from '@/components/ui/Icones';
import Mordida from '@/components/ui/Mordida';

// Tela depois de confirmar o pedido (rota /pedido-confirmado?pedido=123).
export default function PedidoConfirmado({ numero }) {
  return (
    <section className="flex flex-col items-center py-16 text-center sm:py-24">
      <Mordida className="h-20 w-20 text-marca sm:h-24 sm:w-24" />
      <p className="mt-6 text-xs font-bold tracking-[0.14em] text-marca uppercase">Pedido confirmado</p>
      <h1 className="mt-3 max-w-md font-display text-5xl leading-[0.95] font-extrabold tracking-tight sm:text-6xl">
        Já estamos caprichando.
      </h1>
      <p className="mt-5 max-w-sm leading-relaxed text-suave">
        {numero ? (
          <>
            Pedido <strong className="font-semibold text-tinta">#{numero}</strong> recebido.
          </>
        ) : (
          'Seu pedido foi recebido.'
        )}{' '}
        Agora é só acompanhar — e tentar não olhar o relógio a cada minuto.
      </p>

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <Link
          href="/pedidos"
          className="flex h-11 items-center gap-2 rounded-full bg-marca px-6 text-sm font-semibold text-white transition-colors hover:bg-marca-escura"
        >
          Acompanhar pedido
          <IconeSeta className="h-4 w-4" />
        </Link>
        <Link
          href="/cardapio"
          className="flex h-11 items-center rounded-full border border-borda bg-white px-6 text-sm font-semibold transition-colors hover:border-tinta"
        >
          Voltar ao cardápio
        </Link>
      </div>
    </section>
  );
}
