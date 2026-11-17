import { Router } from 'express';

import * as pedidoController from '../controllers/pedidoController.js';
import { autenticar, exigirPerfil } from '../middlewares/authMiddleware.js';
import { validar } from '../middlewares/validacaoMiddleware.js';
import { pedidoSchema, statusPedidoSchema } from '../utils/pedidoSchema.js';

const router = Router();
const somenteCliente = [autenticar, exigirPerfil('cliente')];
const somenteAdmin = [autenticar, exigirPerfil('admin')];

// Cliente
router.post('/', somenteCliente, validar(pedidoSchema), pedidoController.criar);
router.get('/meus', somenteCliente, pedidoController.listarMeus);
router.patch('/:id/cancelar', somenteCliente, pedidoController.cancelar);

// Admin
router.get('/', somenteAdmin, pedidoController.listarTodos);
router.patch('/:id/status', somenteAdmin, validar(statusPedidoSchema), pedidoController.alterarStatus);

export default router;
