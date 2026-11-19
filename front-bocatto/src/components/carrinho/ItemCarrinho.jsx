'use client';

import { useState } from 'react';

import { IconeLixeira, IconeMais, IconeMenos } from '@/components/ui/Icones';
import { QUANTIDADE_MAXIMA, useCart } from '@/contexts/CartContext';
import { formatarMoeda } from '@/utils/formatadores';

// Uma linha do carrinho: foto, nome, descrição, quantidade, remover e preço da linha.
export default function ItemCarrinho({ item }) {
  const { alterarQuantidade } = useCart();
  const { id, nome, descricao, quantidade } = item;

  return (
    <li className="flex gap-4 border-b border-borda py-6 first:pt-0 sm:gap-5">
      <Foto item={item} />

      <div className="flex min-w-0 flex-1 flex-col">
        <h2 className="font-display text-lg leading-tight font-bold">{nome}</h2>
        {descricao && <p className="mt-1.5 line-clamp-2 text-sm text-suave">{descricao}</p>}

        <div className="mt-auto flex items-center gap-4 pt-3">
          <div className="flex h-8 items-center rounded-full border border-borda bg-white">
            <BotaoQuantidade
              rotulo={`Diminuir quantidade de ${nome}`}
              disabled={quantidade <= 1}
              onClick={() => alterarQuantidade(id, quantidade - 1)}
            >
              <IconeMenos className="h-3.5 w-3.5" />
            </BotaoQuantidade>
            <span aria-live="polite" className="min-w-5 text-center text-sm font-semibold tabular-nums">
              {quantidade}
            </span>
            <BotaoQuantidade
              rotulo={`Aumentar quantidade de ${nome}`}
              disabled={quantidade >= QUANTIDADE_MAXIMA}
              onClick={() => alterarQuantidade(id, quantidade + 1)}
            >
              <IconeMais className="h-3.5 w-3.5" />
            </BotaoQuantidade>
          </div>

          <button
            type="button"
            onClick={() => alterarQuantidade(id, 0)}
            aria-label={`Remover ${nome} do carrinho`}
            className="flex items-center gap-1.5 text-xs text-suave transition-colors hover:text-erro"
          >
            <IconeLixeira className="h-3.5 w-3.5" />
            Remover
          </button>

          {/* No celular o preço fica nesta linha; no desktop, na coluna da direita. */}
          <Preco item={item} className="ml-auto sm:hidden" />
        </div>
      </div>

      <Preco item={item} className="hidden self-center sm:block" />
    </li>
  );
}

// Preço da linha (preço × quantidade); com mais de 1 unidade, mostra também o unitário.
function Preco({ item, className }) {
  const centavos = Math.round(Number(item.preco) * 100) * item.quantidade;
  return (
    <div className={`shrink-0 text-right ${className}`}>
      <p className="font-display text-base font-bold text-marca tabular-nums">{formatarMoeda(centavos / 100)}</p>
      {item.quantidade > 1 && (
        <p className="mt-0.5 text-xs text-suave tabular-nums">
          {item.quantidade} × {formatarMoeda(item.preco)}
        </p>
      )}
    </div>
  );
}

function BotaoQuantidade({ rotulo, children, ...props }) {
  return (
    <button
      type="button"
      aria-label={rotulo}
      className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:text-marca disabled:text-suave/40 disabled:hover:text-suave/40"
      {...props}
    >
      {children}
    </button>
  );
}

// Foto do produto ou, sem foto, a inicial da categoria (igual ao cardápio).
function Foto({ item }) {
  const [falhou, setFalhou] = useState(false);
  const caixa = 'relative h-20 w-20 shrink-0 overflow-hidden rounded-xl sm:h-[90px] sm:w-[90px]';

  if (item.imagem_url && !falhou) {
    return (
      <div className={caixa}>
        {/* URLs externas cadastradas pelo admin, como no cardápio. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.imagem_url}
          alt={item.nome}
          loading="lazy"
          onError={() => setFalhou(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className={`${caixa} flex items-center justify-center bg-marca-clara`}>
      <span aria-hidden="true" className="font-display text-4xl font-extrabold text-marca/45">
        {(item.categoria ?? item.nome).charAt(0)}
      </span>
    </div>
  );
}
