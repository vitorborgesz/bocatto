import { Router } from 'express';

import * as produtoController from '../controllers/produtoController.js';
import { autenticar, exigirPerfil } from '../middlewares/authMiddleware.js';
import { validar } from '../middlewares/validacaoMiddleware.js';
import { produtoAtualizacaoSchema, produtoSchema } from '../utils/produtoSchema.js';

const router = Router();
const somenteAdmin = [autenticar, exigirPerfil('admin')];

router.get('/', produtoController.listarAtivos);
router.get('/todos', somenteAdmin, produtoController.listarTodos);
router.post('/', somenteAdmin, validar(produtoSchema), produtoController.criar);
router.put('/:id', somenteAdmin, validar(produtoAtualizacaoSchema), produtoController.atualizar);
router.delete('/:id', somenteAdmin, produtoController.excluir);

export default router;
