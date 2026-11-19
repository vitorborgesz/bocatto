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
