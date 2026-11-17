import cors from 'cors';
import express from 'express';

import { env } from './src/config/env.js';
import { rotaNaoEncontrada, tratarErros } from './src/middlewares/erroMiddleware.js';
import { sequelize } from './src/models/index.js';
import authRoute from './src/routes/authRoute.js';

const app = express();

// CORS restrito: só os front-ends listados em CORS_ORIGINS.
// (CORS protege o usuário no navegador; não impede chamadas pelo Postman/curl.)
app.use(cors({ origin: env.CORS_ORIGINS }));
app.use(express.json());

// API de pé E banco respondendo. 503 se o banco estiver fora.
app.get('/health', async (req, res) => {
  try {
    await sequelize.query('SELECT 1');
    res.json({ status: 'ok', banco: 'ok' });
  } catch {
    res.status(503).json({ status: 'degradado', banco: 'indisponível' });
  }
});

// Rotas por módulo.
app.use('/auth', authRoute);
// Próximos módulos:
// app.use('/categorias', categoriaRoute);
// app.use('/restaurantes', restauranteRoute);
// app.use('/pedidos', pedidoRoute);
// app.use('/painel', painelRoute);

// Precisam vir depois de todas as rotas.
app.use(rotaNaoEncontrada);
app.use(tratarErros);

try {
  await sequelize.authenticate();
  console.log('Conectado ao banco de dados.');
} catch (erro) {
  console.error('Não foi possível conectar ao banco de dados:', erro.message);
  process.exit(1);
}

app.listen(env.PORT, () => {
  console.log(`API do Bocatto rodando em http://localhost:${env.PORT}`);
});
