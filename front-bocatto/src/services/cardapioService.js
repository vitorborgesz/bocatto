import api from './api';

// Categorias na ordem de cadastro (a API devolve em ordem alfabética).
export async function listarCategorias() {
  const { data } = await api.get('/categorias');
  return [...data].sort((a, b) => a.id - b.id);
}

// Só produtos ativos, já com { categoria: { id, nome } }.
export async function listarProdutos() {
  const { data } = await api.get('/produtos');
  return data;
}
