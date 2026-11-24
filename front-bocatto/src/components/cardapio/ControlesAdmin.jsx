'use client';

import { useState } from 'react';

import { IconeLixeira } from '@/components/ui/Icones';
import Interruptor from '@/components/ui/Interruptor';
import { mensagemDeErro } from '@/services/api';
import { atualizarProduto } from '@/services/cardapioService';

// Barra que só o admin vê no card do cardápio: disponível/indisponível, editar e excluir.
// A API confere o perfil de novo (PUT e DELETE /produtos/:id são só para admin).
export default function ControlesAdmin({ produto, aoAtualizar, aoEditar, aoExcluir }) {
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);

  const alternar = async () => {
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
    <div className="mt-4 border-t border-borda pt-3">
      <div className="flex items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-xs font-medium text-suave">
          <Interruptor
            ligado={produto.ativo}
            rotulo={`${produto.nome} disponível`}
            disabled={salvando}
            aoAlternar={alternar}
          />
          {produto.ativo ? 'Disponível' : 'Indisponível'}
        </label>
        <span className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => aoEditar(produto)}
            className="px-1 text-xs font-medium underline underline-offset-2 hover:text-marca"
          >
            Editar
          </button>
          <button
            type="button"
            onClick={() => aoExcluir(produto)}
            aria-label={`Excluir ${produto.nome}`}
            title="Excluir"
            className="flex h-8 w-8 items-center justify-center rounded-full text-suave transition-colors hover:bg-erro/10 hover:text-erro"
          >
            <IconeLixeira className="h-4 w-4" />
          </button>
        </span>
      </div>
      {erro && <p className="mt-2 text-xs text-erro">{erro}</p>}
    </div>
  );
}
