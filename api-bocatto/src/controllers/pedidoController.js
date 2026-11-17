import { STATUS_PEDIDO } from '../models/pedidoModel.js';
import * as pedidoService from '../services/pedidoService.js';
import { AppError } from '../utils/appError.js';

// --- Cliente ---

export async function criar(req, res) {
  const pedido = await pedidoService.criar(req.usuario.id, req.body);
  res.status(201).json(pedido);
}

export async function listarMeus(req, res) {
  const pedidos = await pedidoService.listarDoCliente(req.usuario.id);
  res.json(pedidos);
}

export async function cancelar(req, res) {
  const pedido = await pedidoService.cancelarPeloCliente(req.usuario.id, req.params.id);
  res.json(pedido);
}

// --- Admin ---

// Filtro opcional: ?status=pendente
export async function listarTodos(req, res) {
  const { status } = req.query;
  if (status !== undefined && !STATUS_PEDIDO.includes(status)) {
    throw new AppError(400, 'Status inválido');
  }

  const pedidos = await pedidoService.listarTodos({ status });
  res.json(pedidos);
}

export async function alterarStatus(req, res) {
  const pedido = await pedidoService.alterarStatus(req.params.id, req.body.status);
  res.json(pedido);
}
