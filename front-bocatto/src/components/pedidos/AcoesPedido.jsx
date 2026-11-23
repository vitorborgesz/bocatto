'use client';

import { useId, useState } from 'react';

import { IconeFechar } from '@/components/ui/Icones';
import { mensagemDeErro } from '@/services/api';
import { cancelarPedido } from '@/services/pedidoService';

const link = 'text-xs font-medium underline underline-offset-2 hover:text-marca disabled:opacity-50';
const botao =
  'inline-flex h-9 items-center justify-center gap-2 rounded-full px-4 text-xs font-semibold transition-colors disabled:opacity-60';

// Cancelamento do pedido pelo cliente. A API só permite enquanto está "pendente";
// depois disso, mostra por que não dá mais para cancelar.
export function CancelarPedido({ pedido, aoCancelar }) {
  const [confirmando, setConfirmando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);
  const idTitulo = useId();

  if (pedido.status === 'em_preparo' || pedido.status === 'saiu_para_entrega') {
    return (
      <p className="text-xs text-suave">
        {pedido.status === 'em_preparo' ? 'Já está na cozinha' : 'Já está a caminho'}: não dá mais para cancelar.
      </p>
    );
  }
  if (pedido.status !== 'pendente') return null;

  const confirmar = async () => {
    setEnviando(true);
    setErro(null);
    try {
      aoCancelar(await cancelarPedido(pedido.id));
    } catch (e) {
      setErro(mensagemDeErro(e, 'Não foi possível cancelar o pedido.'));
      setConfirmando(false);
    } finally {
      setEnviando(false);
    }
  };

  if (confirmando) {
    return (
      <div
        role="alertdialog"
        aria-labelledby={idTitulo}
        className="basis-full rounded-2xl border border-erro/25 bg-erro/5 p-4 sm:flex sm:items-center sm:justify-between sm:gap-4"
      >
        <div>
          <p id={idTitulo} className="text-sm font-semibold">
            Cancelar o pedido #{pedido.id}?
          </p>
          <p className="mt-0.5 text-xs text-suave">Depois de cancelado, não dá para desfazer.</p>
        </div>
        <div className="mt-3 flex shrink-0 gap-2 sm:mt-0">
          <button
            type="button"
            autoFocus
            onClick={() => setConfirmando(false)}
            disabled={enviando}
            className={`${botao} border border-borda bg-white hover:border-tinta`}
          >
            Manter pedido
          </button>
          <button
            type="button"
            onClick={confirmar}
            disabled={enviando}
            className={`${botao} bg-erro text-white hover:bg-erro/90`}
          >
            {enviando ? 'Cancelando...' : 'Sim, cancelar'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      <button
        type="button"
        onClick={() => setConfirmando(true)}
        className={`${botao} border border-erro/40 bg-white text-erro hover:border-erro hover:bg-erro hover:text-white`}
      >
        <IconeFechar className="h-3.5 w-3.5" />
        Cancelar pedido
      </button>
      {erro && (
        <p role="alert" className="text-xs text-erro">
          {erro}
        </p>
      )}
    </div>
  );
}

export function BotaoDetalhes({ aberto, aoAlternar }) {
  return (
    <button type="button" onClick={aoAlternar} aria-expanded={aberto} className={link}>
      {aberto ? 'Ocultar detalhes' : 'Ver detalhes'}
    </button>
  );
}
