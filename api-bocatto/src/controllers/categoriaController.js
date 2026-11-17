import { Categoria, Produto } from '../models/index.js';
import { AppError } from '../utils/appError.js';

async function buscarOuFalhar(id) {
  const categoria = await Categoria.findByPk(id);
  if (!categoria) {
    throw new AppError(404, 'Categoria não encontrada');
  }
  return categoria;
}

export async function listar(req, res) {
  const categorias = await Categoria.findAll({ order: [['nome', 'ASC']] });
  res.json(categorias);
}

export async function criar(req, res) {
  const categoria = await Categoria.create(req.body);
  res.status(201).json(categoria);
}

export async function atualizar(req, res) {
  const categoria = await buscarOuFalhar(req.params.id);
  await categoria.update(req.body);
  res.json(categoria);
}

export async function excluir(req, res) {
  const categoria = await buscarOuFalhar(req.params.id);

  // A FK também recusa, mas assim a mensagem fica mais clara.
  if (await Produto.count({ where: { categoria_id: categoria.id } })) {
    throw new AppError(409, 'A categoria tem produtos. Mova-os para outra categoria antes de excluir.');
  }

  await categoria.destroy();
  res.status(204).end();
}
