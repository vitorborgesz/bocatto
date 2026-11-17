import axios from 'axios';

import { CHAVES, lerLocal, salvarLocal } from '@/utils/armazenamentoLocal';

// Instância única do axios: toda chamada à API passa por aqui (via services/).
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333',
});

// Envia o token da sessão em toda requisição.
api.interceptors.request.use((config) => {
  const token = lerLocal(CHAVES.sessao)?.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (resposta) => resposta,
  (erro) => {
    // Token expirado ou inválido: encerra a sessão. As áreas protegidas
    // percebem a mudança e mandam para o login.
    if (erro.response?.status === 401 && lerLocal(CHAVES.sessao)) {
      salvarLocal(CHAVES.sessao, null);
    }
    return Promise.reject(erro);
  },
);

// Mensagem enviada pela API ({ erro: '...' }) ou um texto padrão.
export function mensagemDeErro(erro, padrao = 'Não foi possível concluir a operação.') {
  return erro.response?.data?.erro ?? padrao;
}

export default api;
