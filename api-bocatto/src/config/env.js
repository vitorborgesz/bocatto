import path from 'node:path';

import dotenv from 'dotenv';
import { z } from 'zod';

// Fora do Docker (npm run dev dentro de api-bocatto/), lê o .env central em db-bocatto/.
// No Docker o arquivo não existe dentro do container: as variáveis chegam pelo
// docker-compose.yaml, e esta linha simplesmente não encontra nada.
dotenv.config({ path: path.resolve(import.meta.dirname, '../../../db-bocatto/.env'), quiet: true });

// Todas as variáveis são validadas na inicialização. Se faltar alguma
// obrigatória, a API não sobe (falhar cedo é melhor que falhar no meio de uma requisição).
const schema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(3333),

  POSTGRES_HOST: z.string().min(1).default('localhost'),
  POSTGRES_PORT: z.coerce.number().int().positive().default(5433),
  POSTGRES_USER: z.string().min(1),
  POSTGRES_PASSWORD: z.string().min(1),
  POSTGRES_DB: z.string().min(1),

  // Chave curta pode ser descoberta por força bruta, e aí qualquer um forja tokens.
  JWT_SECRET: z.string().min(32, 'precisa ter pelo menos 32 caracteres'),
  JWT_EXPIRES_IN: z.string().min(1).default('8h'),

  // Origens (front-ends) liberadas no CORS, separadas por vírgula.
  CORS_ORIGINS: z
    .string()
    .default('http://localhost:3000')
    .transform((valor) => valor.split(',').map((origem) => origem.trim()).filter(Boolean)),
});

const resultado = schema.safeParse(process.env);

if (!resultado.success) {
  console.error('Variáveis de ambiente inválidas (confira o .env):');
  for (const problema of resultado.error.issues) {
    console.error(`  - ${problema.path.join('.')}: ${problema.message}`);
  }
  process.exit(1);
}

export const env = resultado.data;
