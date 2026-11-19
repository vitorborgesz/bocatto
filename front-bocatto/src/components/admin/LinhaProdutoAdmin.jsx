'use client';

import { useState } from 'react';

import Interruptor from '@/components/ui/Interruptor';
import { mensagemDeErro } from '@/services/api';
import { atualizarProduto } from '@/services/cardapioService';
import { formatarMoeda } from '@/utils/formatadores';

// Linha do produto no painel: foto, nome, categoria, preço, disponível e editar.
export default function LinhaProdutoAdmin({ produto, aoAtualizar, aoEditar }) {
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);
  const [fotoFalhou, setFotoFalhou] = useState(false);

  const alternarDisponivel = async () => {
    setSalvando(true);
    setErro(null);
    try {
      aoAtualizar(await atualizarProduto(produto.id, { ativo: !produto.ativo }));
    } catch (e) {
      setErro(mensagemDeErro(e, 'Não foi possível alterar.'));
    } finally {
      setSalvando(false);
    }
  };

  return (
    <li className="border-b border-borda py-4 last:border-b-0">
      <div className="flex items-center gap-4">
        <div
          className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-marca-clara ${produto.ativo ? '' : 'opacity-50'}`}
        >
          {produto.imagem_url && !fotoFalhou ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={produto.imagem_url}
              alt=""
              loading="lazy"
              onError={() => setFotoFalhou(true)}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <span aria-hidden="true" className="flex h-full items-center justify-center font-display text-2xl font-extrabold text-marca/45">
              {(produto.categoria?.nome ?? produto.nome).charAt(0)}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-x-2 font-display leading-tight font-bold">
            <span className={produto.ativo ? '' : 'text-suave'}>{produto.nome}</span>
            {!produto.ativo && (
              <span className="rounded-full bg-zinc-200/70 px-2 py-0.5 font-sans text-[10px] font-semibold text-zinc-600">
                Indisponível
              </span>
            )}
          </p>
          <p className="mt-0.5 truncate text-xs text-suave">
            {produto.categoria?.nome}
            {produto.descricao && <span className="hidden sm:inline"> · {produto.descricao}</span>}
          </p>
        </div>

        <span className="hidden font-display text-sm font-bold text-marca tabular-nums sm:block">
          {formatarMoeda(produto.preco)}
        </span>
        <Interruptor
          ligado={produto.ativo}
          rotulo={`${produto.nome} disponível`}
          disabled={salvando}
          aoAlternar={alternarDisponivel}
        />
        <button
          type="button"
          onClick={() => aoEditar(produto)}
          className="text-xs font-medium underline underline-offset-2 hover:text-marca"
        >
          Editar
        </button>
      </div>
      <p className="mt-1 pl-[72px] font-display text-sm font-bold text-marca tabular-nums sm:hidden">
        {formatarMoeda(produto.preco)}
      </p>
      {erro && <p className="mt-2 text-right text-xs text-erro">{erro}</p>}
    </li>
  );
}
