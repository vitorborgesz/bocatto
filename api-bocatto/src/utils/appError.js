// Erro "esperado" da aplicação, com o status HTTP que deve ser devolvido.
// Lance em qualquer camada: throw new AppError(404, 'Restaurante não encontrado').
// O tratarErros (middlewares/erroMiddleware.js) transforma em resposta JSON.
export class AppError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
