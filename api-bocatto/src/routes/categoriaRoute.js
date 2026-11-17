import { Router } from 'express';

import * as categoriaController from '../controllers/categoriaController.js';
import { autenticar, exigirPerfil } from '../middlewares/authMiddleware.js';
import { validar } from '../middlewares/validacaoMiddleware.js';
import { categoriaSchema } from '../utils/categoriaSchema.js';

const router = Router();
const somenteAdmin = [autenticar, exigirPerfil('admin')];

router.get('/', categoriaController.listar);
router.post('/', somenteAdmin, validar(categoriaSchema), categoriaController.criar);
router.put('/:id', somenteAdmin, validar(categoriaSchema), categoriaController.atualizar);
router.delete('/:id', somenteAdmin, categoriaController.excluir);

export default router;
