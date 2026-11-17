import { ForeignKeyConstraintError, UniqueConstraintError, ValidationError } from 'sequelize';

import { env } from '../config/env.js';
import { AppError } from '../utils/appError.js';

// Nenhuma rota respondeu.
export function rotaNaoEncontrada(req, res) {
  res.status(404).json({ erro: 'Rota não encontrada' });
}

// Tratamento centralizado: qualquer erro lançado (ou promise rejeitada,
// no Express 5) em rotas, controllers ou services chega aqui.
// O Express só reconhece o middleware de erro pelos 4 parâmetros.
// eslint-disable-next-line no-unused-vars
export function tratarErros(err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.status).json({ erro: err.message });
  }

  // UniqueConstraintError herda de ValidationError: precisa vir antes.
  if (err instanceof UniqueConstraintError) {
    return res.status(409).json({ erro: 'Já existe um registro com esses dados' });
  }

  if (err instanceof ValidationError) {
    return res.status(400).json({
      erro: 'Dados inválidos',
      detalhes: err.errors.map((e) => ({ campo: e.path, mensagem: e.message })),
    });
  }

  if (err instanceof ForeignKeyConstraintError) {
    return res.status(409).json({ erro: 'Registro relacionado não existe ou ainda está em uso' });
  }

  // CHECK do PostgreSQL (ex.: preço zero).
  if (err.parent?.code === '23514') {
    return res.status(400).json({ erro: 'Dados inválidos' });
  }

  // Valor que não serve para a coluna, como /produtos/abc num id numérico.
  if (err.parent?.code === '22P02') {
    return res.status(400).json({ erro: 'Parâmetro inválido' });
  }

  // Corpo da requisição com JSON malformado.
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ erro: 'JSON inválido' });
  }

  console.error(err);
  return res.status(500).json({
    erro: 'Erro interno do servidor',
    // Detalhes técnicos só em desenvolvimento.
    ...(env.NODE_ENV === 'production' ? {} : { detalhe: err.message }),
  });
}
