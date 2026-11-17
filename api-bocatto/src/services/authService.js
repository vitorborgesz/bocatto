import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UniqueConstraintError } from 'sequelize';

import { env } from '../config/env.js';
import { Usuario } from '../models/index.js';
import { AppError } from '../utils/appError.js';

const RODADAS_BCRYPT = 10;

// Hash de uma senha qualquer, usado quando o e-mail NÃO existe no login:
// o tempo de resposta fica parecido nos dois casos e não revela quais
// e-mails estão cadastrados.
const HASH_FICTICIO = bcrypt.hashSync('senha-ficticia-para-equalizar-tempo', RODADAS_BCRYPT);

const semSenha = (usuario) => {
  const { senha_hash: _, ...dados } = usuario.get({ plain: true });
  return dados;
};

export function gerarToken(usuario) {
  // O conteúdo do JWT é apenas codificado, não cifrado: só o id vai nele.
  return jwt.sign({ sub: String(usuario.id) }, env.JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: env.JWT_EXPIRES_IN,
  });
}

export function verificarToken(token) {
  // Lista explícita: quem decide o algoritmo é o servidor, não o token.
  return jwt.verify(token, env.JWT_SECRET, { algorithms: ['HS256'] });
}

export async function buscarUsuarioAtivo(id) {
  const usuario = await Usuario.findByPk(id);
  return usuario?.ativo ? usuario : null;
}

// Cadastro público: sempre cria um CLIENTE. Contas de restaurante vêm do seed.
export async function cadastrar({ nome, email, senha }) {
  const senha_hash = await bcrypt.hash(senha, RODADAS_BCRYPT);

  try {
    const usuario = await Usuario.create({ nome, email, senha_hash, perfil: 'cliente' });
    return semSenha(usuario);
  } catch (erro) {
    // Quem garante e-mail único é a constraint do banco (checar antes com
    // um SELECT não impede duas requisições simultâneas).
    if (erro instanceof UniqueConstraintError) {
      throw new AppError(409, 'E-mail já cadastrado');
    }
    throw erro;
  }
}

export async function login({ email, senha }) {
  const usuario = await Usuario.unscoped().findOne({ where: { email } });

  // Compara a senha MESMO se o usuário não existir (tempo de resposta parecido).
  const senhaOk = await bcrypt.compare(senha, usuario?.senha_hash ?? HASH_FICTICIO);

  if (!usuario || !senhaOk || !usuario.ativo) {
    // Mesma mensagem para "e-mail não existe" e "senha errada".
    throw new AppError(401, 'E-mail ou senha inválidos');
  }

  return { token: gerarToken(usuario), usuario: semSenha(usuario) };
}
