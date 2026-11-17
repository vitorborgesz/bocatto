// Valida o corpo da requisição com um schema do Zod.
// Uso na rota: router.post('/login', validar(loginSchema), controller.login)
// Se passar, req.body é substituído pelos dados já validados e normalizados.
export const validar = (schema) => (req, res, next) => {
  const resultado = schema.safeParse(req.body ?? {});

  if (!resultado.success) {
    return res.status(400).json({
      erro: 'Dados inválidos',
      detalhes: resultado.error.issues.map((problema) => ({
        campo: problema.path.join('.'),
        mensagem: problema.message,
      })),
    });
  }

  req.body = resultado.data;
  return next();
};
