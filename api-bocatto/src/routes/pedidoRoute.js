import { Router } from 'express';

import * as pedidoController from '../controllers/pedidoController.js';
import { autenticar, exigirPerfil } from '../middlewares/authMiddleware.js';
import { validar } from '../middlewares/validacaoMiddleware.js';
import { pedidoSchema, statusPedidoSchema } from '../utils/pedidoSchema.js';

const router = Router();
// Uso pessoal (qualquer conta: o admin também compra). Cada um só vê e mexe nos PRÓPRIOS pedidos.
const usuarioLogado = [autenticar, exigirPerfil('cliente', 'admin')];
// Gestão: pedidos de todos os clientes.
const somenteAdmin = [autenticar, exigirPerfil('admin')];

// Público: o carrinho mostra a taxa antes do login.
router.get('/taxa-entrega', pedidoController.taxaEntrega);

// Pedidos pessoais (cliente ou admin)
router.post('/', usuarioLogado, validar(pedidoSchema), pedidoController.criar);
router.get('/meus', usuarioLogado, pedidoController.listarMeus);
router.patch('/:id/cancelar', usuarioLogado, pedidoController.cancelar);

// Gestão (só admin)
router.get('/', somenteAdmin, pedidoController.listarTodos);
router.patch('/:id/status', somenteAdmin, validar(statusPedidoSchema), pedidoController.alterarStatus);

export default router;
