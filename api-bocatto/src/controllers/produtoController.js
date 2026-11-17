import { Produto } from '../models/index.js';
import { AppError } from '../utils/appError.js';

const INCLUIR_CATEGORIA = { association: 'categoria', attributes: ['id', 'nome'] };

// Cardápio público: só produtos ativos. Filtro opcional: ?categoria_id=1
export async function listarAtivos(req, res) {
  const where = { ativo: true };
  if (req.query.categoria_id) {
    where.categoria_id = req.query.categoria_id;
  }

  const produtos = await Produto.findAll({ where, include: [INCLUIR_CATEGORIA], order: [['nome', 'ASC']] });
  res.json(produtos);
}

// Painel do admin: inclui os inativos.
export async function listarTodos(req, res) {
  const produtos = await Produto.findAll({ include: [INCLUIR_CATEGORIA], order: [['nome', 'ASC']] });
  res.json(produtos);
}

export async function criar(req, res) {
  const produto = await Produto.create(req.body);
  res.status(201).json(produto);
}

// Edição parcial: também serve para ativar/desativar ({ "ativo": false }).
export async function atualizar(req, res) {
  const produto = await Produto.findByPk(req.params.id);
  if (!produto) {
    throw new AppError(404, 'Produto não encontrado');
  }

  await produto.update(req.body);
  res.json(produto);
}
