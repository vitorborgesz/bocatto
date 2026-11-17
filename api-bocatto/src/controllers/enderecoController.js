import { Endereco } from '../models/index.js';
import { AppError } from '../utils/appError.js';

// O cliente só enxerga e altera os PRÓPRIOS endereços.
async function buscarDoUsuario(id, usuarioId) {
  const endereco = await Endereco.findOne({ where: { id, usuario_id: usuarioId } });
  if (!endereco) {
    throw new AppError(404, 'Endereço não encontrado');
  }
  return endereco;
}

export async function listar(req, res) {
  const enderecos = await Endereco.findAll({
    where: { usuario_id: req.usuario.id },
    order: [['id', 'ASC']],
  });
  res.json(enderecos);
}

export async function criar(req, res) {
  const endereco = await Endereco.create({ ...req.body, usuario_id: req.usuario.id });
  res.status(201).json(endereco);
}

export async function atualizar(req, res) {
  const endereco = await buscarDoUsuario(req.params.id, req.usuario.id);
  await endereco.update(req.body);
  res.json(endereco);
}

// Os pedidos guardam uma cópia do endereço, então excluir não afeta o histórico.
export async function excluir(req, res) {
  const endereco = await buscarDoUsuario(req.params.id, req.usuario.id);
  await endereco.destroy();
  res.status(204).end();
}
