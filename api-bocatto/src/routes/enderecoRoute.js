import { Router } from 'express';

import * as enderecoController from '../controllers/enderecoController.js';
import { autenticar, exigirPerfil } from '../middlewares/authMiddleware.js';
import { validar } from '../middlewares/validacaoMiddleware.js';
import { enderecoAtualizacaoSchema, enderecoSchema } from '../utils/enderecoSchema.js';

const router = Router();

// Endereços pessoais de quem está logado (cliente ou admin): cada um só vê os próprios.
router.use(autenticar, exigirPerfil('cliente', 'admin'));

router.get('/', enderecoController.listar);
router.post('/', validar(enderecoSchema), enderecoController.criar);
router.put('/:id', validar(enderecoAtualizacaoSchema), enderecoController.atualizar);
router.delete('/:id', enderecoController.excluir);

export default router;
