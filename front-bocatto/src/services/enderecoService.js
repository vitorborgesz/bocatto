import api from './api';

// Endereços salvos do cliente logado, na ordem de cadastro.
export async function listarEnderecos() {
  const { data } = await api.get('/enderecos');
  return data;
}

// { apelido?, rua, numero, complemento?, bairro, cidade, cep }. Devolve o endereço criado.
export async function criarEndereco(endereco) {
  const { data } = await api.post('/enderecos', endereco);
  return data;
}
