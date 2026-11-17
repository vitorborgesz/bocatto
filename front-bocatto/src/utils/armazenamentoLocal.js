import { useMemo, useSyncExternalStore } from 'react';

// Leitura e escrita de JSON no localStorage, avisando quem estiver inscrito
// (useArmazenamentoLocal) para a tela atualizar na hora.

export const CHAVES = {
  sessao: 'bocatto:sessao', // { token, usuario }
  carrinho: 'bocatto:carrinho', // { itens }
};

const EVENTO = 'bocatto:armazenamento';

export function lerLocal(chave) {
  if (typeof window === 'undefined') return null;
  try {
    return JSON.parse(localStorage.getItem(chave));
  } catch {
    return null;
  }
}

export function salvarLocal(chave, valor) {
  if (valor === null || valor === undefined) {
    localStorage.removeItem(chave);
  } else {
    localStorage.setItem(chave, JSON.stringify(valor));
  }
  // O evento "storage" do navegador só dispara nas OUTRAS abas; este avisa a aba atual.
  window.dispatchEvent(new Event(EVENTO));
}

export function assinarLocal(avisar) {
  window.addEventListener('storage', avisar);
  window.addEventListener(EVENTO, avisar);
  return () => {
    window.removeEventListener('storage', avisar);
    window.removeEventListener(EVENTO, avisar);
  };
}

// --- Hook para os componentes de cliente ---

const lerNoServidor = () => undefined;

// Valor guardado no localStorage (já convertido de JSON), atualizado sempre que muda.
// Devolve `undefined` enquanto renderiza no servidor e na hidratação (ainda não dá
// para saber), e `null` quando não há nada guardado.
export function useArmazenamentoLocal(chave) {
  // O snapshot precisa ser o mesmo valor entre renders: por isso lê a STRING
  // e só converte depois (um JSON.parse aqui criaria um objeto novo a cada render).
  const texto = useSyncExternalStore(assinarLocal, () => localStorage.getItem(chave), lerNoServidor);

  return useMemo(() => {
    if (texto === undefined) return undefined;
    try {
      return JSON.parse(texto);
    } catch {
      return null;
    }
  }, [texto]);
}
