import { Sequelize } from 'sequelize';

import { env } from './env.js';

// Ponto único de conexão com o PostgreSQL.
// - A API usa a instância `sequelize` (importada por models/index.js).
// - O Sequelize CLI (migrations e seeders) usa o export default, indicado no .sequelizerc.
const conexao = {
  database: env.POSTGRES_DB,
  username: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  host: env.POSTGRES_HOST,
  port: env.POSTGRES_PORT,
  dialect: 'postgres',
  logging: false,
  // Padrão de todos os models: colunas de data em português.
  define: {
    createdAt: 'criado_em',
    updatedAt: 'atualizado_em',
  },
};

// Criar a instância não abre conexão: ela só acontece na primeira consulta.
export const sequelize = new Sequelize(conexao);

// O CLI escolhe a configuração pelo NODE_ENV; é a mesma nos três casos.
export default {
  development: conexao,
  test: conexao,
  production: conexao,
};
