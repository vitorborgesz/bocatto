import api from './api';

// Devolve { token, usuario }.
export async function login({ email, senha }) {
  const { data } = await api.post('/auth/login', { email, senha });
  return data;
}

// Cria uma conta de cliente. Devolve o usuário criado (sem token).
export async function cadastrar({ nome, email, senha }) {
  const { data } = await api.post('/auth/cadastro', { nome, email, senha });
  return data;
}

export async function buscarUsuarioLogado() {
  const { data } = await api.get('/auth/me');
  return data;
}
