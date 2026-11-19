'use client';

import { useEffect, useState } from 'react';

import { IconeCheck, IconeMais } from '@/components/ui/Icones';
import Mordida from '@/components/ui/Mordida';
import { useCart } from '@/contexts/CartContext';
import { formatarMoeda } from '@/utils/formatadores';

// Card horizontal: foto (ou placeholder com a inicial da categoria) + nome, descrição e preço.
export default function CardProduto({ produto, inicial, comMordida = false }) {
  const { adicionar } = useCart();
  const [adicionado, setAdicionado] = useState(false);
  const [fotoFalhou, setFotoFalhou] = useState(false);
  const temFoto = Boolean(produto.imagem_url) && !fotoFalhou;

  // Mostra o "check" por um instante depois de adicionar.
  useEffect(() => {
    if (!adicionado) return undefined;
    const timer = setTimeout(() => setAdicionado(false), 1200);
    return () => clearTimeout(timer);
  }, [adicionado]);

  const aoAdicionar = () => {
    adicionar(produto);
    setAdicionado(true);
  };

  return (
    <article className="flex min-h-40 overflow-hidden rounded-2xl border border-borda bg-white transition-shadow hover:shadow-[0_6px_24px_-12px_rgba(31,22,18,0.18)]">
      <div className="relative w-28 shrink-0 sm:w-[135px]">
        {temFoto ? (
          // Imagens vêm de URLs externas cadastradas pelo admin; <img> evita configurar domínios no next/image.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={produto.imagem_url}
            alt={produto.nome}
            loading="lazy"
            onError={() => setFotoFalhou(true)}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-marca-clara">
            {comMordida && <Mordida className="absolute top-5 left-5 h-6 w-6 text-marca" />}
            <span aria-hidden="true" className="font-display text-6xl font-extrabold text-marca/45">
              {inicial}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h2 className="font-display text-lg leading-tight font-bold">{produto.nome}</h2>
        {produto.descricao && (
          <p className="mt-2 line-clamp-2 text-sm text-suave">{produto.descricao}</p>
        )}

        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="font-display text-base font-bold text-marca tabular-nums">
            {formatarMoeda(produto.preco)}
          </span>
          <button
            type="button"
            onClick={aoAdicionar}
            aria-label={`Adicionar ${produto.nome} ao carrinho`}
            className={`flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca ${
              adicionado ? 'bg-sucesso' : 'bg-marca hover:bg-marca-escura'
            }`}
          >
            {adicionado ? <IconeCheck className="h-4 w-4" /> : <IconeMais className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </article>
  );
}
