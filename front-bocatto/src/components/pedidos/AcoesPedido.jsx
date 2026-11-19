'use client';

import { useState } from 'react';

import { mensagemDeErro } from '@/services/api';
import { cancelarPedido } from '@/services/pedidoService';

const link = 'text-xs font-medium underline underline-offset-2 hover:text-marca disabled:opacity-50';

// Cancelamento com confirmação em linha (sem modal). Só aparece para pedidos pendentes.
export function CancelarPedido({ pedido, aoCancelar }) {
  const [confirmando, setConfirmando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);

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

  return (
    <div className="text-right">
      {confirmando ? (
        <span className="flex items-center gap-3 text-xs">
          <span className="text-suave">Cancelar mesmo?</span>
          <button type="button" onClick={confirmar} disabled={enviando} className={`${link} text-erro`}>
            {enviando ? 'Cancelando...' : 'Sim, cancelar'}
          </button>
          <button type="button" onClick={() => setConfirmando(false)} disabled={enviando} className={link}>
            Não
          </button>
        </span>
      ) : (
        <button type="button" onClick={() => setConfirmando(true)} className={link}>
          Cancelar pedido
        </button>
      )}
      {erro && <p className="mt-1 text-xs text-erro">{erro}</p>}
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
