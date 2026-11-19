import api from './api';

// Pedidos do cliente logado, do mais recente para o mais antigo (já com os itens).
export async function listarMeusPedidos() {
  const { data } = await api.get('/pedidos/meus');
  return data;
}

// Só funciona enquanto o pedido está "pendente". Devolve o pedido atualizado.
export async function cancelarPedido(id) {
  const { data } = await api.patch(`/pedidos/${id}/cancelar`);
  return data;
}

// Taxa de entrega fixa definida na API (rota pública). Devolve o valor como texto: "5.00".
export async function buscarTaxaEntrega() {
  const { data } = await api.get('/pedidos/taxa-entrega');
  return data.taxa_entrega;
}

// Só ids e quantidades: nome, preço e total são calculados pela API. Devolve o pedido criado.
export async function criarPedido({ enderecoId, itens }) {
  const { data } = await api.post('/pedidos', {
    endereco_id: enderecoId,
    itens: itens.map((item) => ({ produto_id: item.id, quantidade: item.quantidade })),
  });
  return data;
}

// --- Admin ---

// Todos os pedidos (com itens e { cliente: { id, nome, email } }), do mais recente ao mais antigo.
export async function listarTodosPedidos() {
  const { data } = await api.get('/pedidos');
  return data;
}

// Avança ou cancela um pedido. A API só aceita as transições do fluxo. Devolve o pedido atualizado.
export async function alterarStatusPedido(id, status) {
  const { data } = await api.patch(`/pedidos/${id}/status`, { status });
  return data;
}
