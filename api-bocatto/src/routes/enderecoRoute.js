import { Router } from 'express';

import * as enderecoController from '../controllers/enderecoController.js';
import { autenticar, exigirPerfil } from '../middlewares/authMiddleware.js';
import { validar } from '../middlewares/validacaoMiddleware.js';
import { enderecoAtualizacaoSchema, enderecoSchema } from '../utils/enderecoSchema.js';

const router = Router();

// Todas as rotas de endereço são do cliente logado.
router.use(autenticar, exigirPerfil('cliente'));

router.get('/', enderecoController.listar);
router.post('/', validar(enderecoSchema), enderecoController.criar);
router.put('/:id', validar(enderecoAtualizacaoSchema), enderecoController.atualizar);
router.delete('/:id', enderecoController.excluir);

export default router;
