import * as authService from '../services/authService.js';

// Controllers cuidam só do HTTP: pegam os dados já validados da requisição,
// chamam o service e devolvem a resposta. Erros sobem para o tratarErros (erroMiddleware.js).

export async function cadastrar(req, res) {
  const usuario = await authService.cadastrar(req.body);
  res.status(201).json(usuario);
}

export async function login(req, res) {
  const resultado = await authService.login(req.body);
  res.json(resultado);
}

export function me(req, res) {
  res.json(req.usuario);
}
