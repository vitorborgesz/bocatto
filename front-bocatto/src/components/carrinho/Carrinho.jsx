'use client';

import Link from 'next/link';

import AvisoRemovidos from '@/components/carrinho/AvisoRemovidos';
import CarrinhoVazio from '@/components/carrinho/CarrinhoVazio';
import ItemCarrinho from '@/components/carrinho/ItemCarrinho';
import ResumoPedido, { classeBotaoResumo } from '@/components/carrinho/ResumoPedido';
import { useDadosCarrinho } from '@/components/carrinho/useDadosCarrinho';
import { IconeSeta } from '@/components/ui/Icones';
import { useCart } from '@/contexts/CartContext';

// Tela /carrinho: itens com quantidade + resumo com subtotal, taxa de entrega e total.
export default function Carrinho() {
  const { itens, subtotal, carregando } = useCart();
  const { taxa, removidos } = useDadosCarrinho();

  return (
    <section className="pt-6 pb-12 sm:pt-12">
      <p className="text-xs font-bold tracking-[0.14em] text-marca uppercase">Quase lá</p>
      <h1 className="mt-3 font-display text-5xl font-extrabold tracking-tight sm:text-6xl">Seu carrinho</h1>

      <AvisoRemovidos nomes={removidos} />

      {carregando && <Esqueleto />}

      {!carregando && itens.length === 0 && <CarrinhoVazio />}

      {!carregando && itens.length > 0 && (
        <div className="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14">
          <ul>
            {itens.map((item) => (
              <ItemCarrinho key={item.id} item={item} />
            ))}
          </ul>
          <ResumoPedido subtotal={subtotal} taxa={taxa}>
            <Link href="/checkout" className={classeBotaoResumo}>
              Continuar
              <IconeSeta className="h-4 w-4" />
            </Link>
          </ResumoPedido>
        </div>
      )}
    </section>
  );
}

function Esqueleto() {
  return (
    <div aria-hidden="true" className="mt-10 grid animate-pulse gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14">
      <div>
        {[0, 1].map((n) => (
          <div key={n} className="flex gap-5 border-b border-borda py-6 first:pt-0">
            <div className="h-20 w-20 shrink-0 rounded-xl bg-borda sm:h-[90px] sm:w-[90px]" />
            <div className="flex-1 space-y-3 pt-1">
              <div className="h-4 w-1/3 rounded bg-borda" />
              <div className="h-3 w-2/3 rounded bg-borda" />
              <div className="h-8 w-28 rounded-full bg-borda" />
            </div>
          </div>
        ))}
      </div>
      <div className="h-72 rounded-2xl bg-borda/60" />
    </div>
  );
}
