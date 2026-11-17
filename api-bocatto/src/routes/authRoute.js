import { Router } from 'express';

import * as authController from '../controllers/authController.js';
import { autenticar } from '../middlewares/authMiddleware.js';
import { validar } from '../middlewares/validacaoMiddleware.js';
import { cadastroSchema, loginSchema } from '../utils/authSchema.js';

const router = Router();

router.post('/cadastro', validar(cadastroSchema), authController.cadastrar);
router.post('/login', validar(loginSchema), authController.login);
router.get('/me', autenticar, authController.me);

export default router;
