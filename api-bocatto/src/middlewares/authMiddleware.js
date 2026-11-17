import { buscarUsuarioAtivo, verificarToken } from '../services/authService.js';
import { AppError } from '../utils/appError.js';

// Exige "Authorization: Bearer <token>" e coloca o usuário em req.usuario.
export async function autenticar(req, res, next) {
  const [esquema, token] = (req.headers.authorization ?? '').split(' ');

  if (esquema !== 'Bearer' || !token) {
    throw new AppError(401, 'Token não informado');
  }

  let payload;
  try {
    payload = verificarToken(token);
  } catch {
    throw new AppError(401, 'Sessão inválida ou expirada');
  }

  // Token válido de um usuário desativado (ou apagado) também é recusado.
  // O perfil é lido do banco, não do token, porque pode ter mudado.
  const usuario = await buscarUsuarioAtivo(Number(payload.sub));
  if (!usuario) {
    throw new AppError(401, 'Sessão inválida ou expirada');
  }

  req.usuario = usuario;
  return next();
}

// Restringe a rota a um ou mais perfis. Usar DEPOIS de autenticar.
// Ex.: router.get('/pedidos', autenticar, exigirPerfil('admin'), ...)
export const exigirPerfil = (...perfis) => (req, res, next) => {
  if (!perfis.includes(req.usuario?.perfil)) {
    throw new AppError(403, 'Você não tem permissão para acessar este recurso');
  }
  return next();
};
