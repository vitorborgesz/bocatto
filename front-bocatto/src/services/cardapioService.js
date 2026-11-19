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

// --- Admin ---

// Todos os produtos, inclusive os indisponíveis.
export async function listarTodosProdutos() {
  const { data } = await api.get('/produtos/todos');
  return data;
}

// { categoria_id, nome, descricao?, preco (número), imagem_url?, ativo? }
export async function criarProduto(produto) {
  const { data } = await api.post('/produtos', produto);
  return data;
}

// Edição parcial: { ativo: false } só deixa indisponível.
export async function atualizarProduto(id, campos) {
  const { data } = await api.put(`/produtos/${id}`, campos);
  return data;
}

export async function criarCategoria(nome) {
  const { data } = await api.post('/categorias', { nome });
  return data;
}

export async function renomearCategoria(id, nome) {
  const { data } = await api.put(`/categorias/${id}`, { nome });
  return data;
}

// A API recusa (409) se a categoria ainda tiver produtos.
export async function excluirCategoria(id) {
  await api.delete(`/categorias/${id}`);
}
