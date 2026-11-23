'use client';

import { useState } from 'react';

import { mensagemDeErro } from '@/services/api';
import { excluirProduto } from '@/services/cardapioService';

// Conteúdo do Modal "Excluir produto": explica o que acontece e pede confirmação.
export default function ConfirmarExclusao({ produto, aoExcluir, aoCancelar }) {
  const [excluindo, setExcluindo] = useState(false);
  const [erro, setErro] = useState(null);

  const confirmar = async () => {
    setExcluindo(true);
    setErro(null);
    try {
      await excluirProduto(produto.id);
      aoExcluir(produto.id);
    } catch (e) {
      setErro(mensagemDeErro(e, 'Não foi possível excluir o produto.'));
      setExcluindo(false);
    }
  };

  return (
    <div className="mt-4">
      <p className="text-suave">
        <strong className="font-semibold text-tinta">{produto.nome}</strong> sai do cardápio e do painel de vez.
        Os pedidos antigos continuam mostrando o nome e o preço normalmente.
      </p>
      <p className="mt-3 rounded-xl bg-marca-clara px-4 py-3 text-sm">
        Só quer tirar do cardápio por um tempo? Use o interruptor de <strong>disponível</strong> em vez de excluir.
      </p>

      {erro && (
        <p role="alert" className="mt-4 rounded-xl bg-erro/8 px-3 py-2.5 text-sm text-erro">
          {erro}
        </p>
      )}

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          autoFocus
          onClick={aoCancelar}
          disabled={excluindo}
          className="h-10 rounded-full border border-borda bg-white px-5 text-sm font-semibold transition-colors hover:border-tinta"
        >
          Manter produto
        </button>
        <button
          type="button"
          onClick={confirmar}
          disabled={excluindo}
          className="h-10 rounded-full bg-erro px-5 text-sm font-semibold text-white transition-colors hover:bg-erro/90 disabled:opacity-60"
        >
          {excluindo ? 'Excluindo...' : 'Sim, excluir'}
        </button>
      </div>
    </div>
  );
}
