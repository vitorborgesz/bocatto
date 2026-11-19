import { Sequelize } from 'sequelize';

import { env } from './env.js';

// Ponto único de conexão com o PostgreSQL.
// - A API usa a instância `sequelize` (importada por models/index.js).
// - O Sequelize CLI (migrations e seeders) usa o export default, indicado no .sequelizerc.
const conexao = {
  database: env.POSTGRES_DATABASE,
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
// seederStorage: registra os seeders já executados na tabela "SequelizeData",
// para que "npm run db:seed" não tente inserir os mesmos dados duas vezes.
const configCli = { ...conexao, seederStorage: 'sequelize' };

export default {
  development: configCli,
  test: configCli,
  production: configCli,
};
