'use client';

import { createContext, useCallback, useContext, useMemo } from 'react';

import * as authService from '@/services/authService';
import { CHAVES, salvarLocal, useArmazenamentoLocal } from '@/utils/armazenamentoLocal';

const AuthContext = createContext(null);

// Sessão do usuário ({ token, usuario }), guardada no localStorage.
export function AuthProvider({ children }) {
  const sessao = useArmazenamentoLocal(CHAVES.sessao);

  const login = useCallback(async (credenciais) => {
    const resultado = await authService.login(credenciais);
    salvarLocal(CHAVES.sessao, resultado);
    return resultado.usuario;
  }, []);

  const logout = useCallback(() => salvarLocal(CHAVES.sessao, null), []);

  const valor = useMemo(
    () => ({
      usuario: sessao?.usuario ?? null,
      // true só no primeiro render (servidor/hidratação), antes de ler o localStorage.
      carregando: sessao === undefined,
      login,
      logout,
    }),
    [sessao, login, logout],
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  return contexto;
}
