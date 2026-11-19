import { z } from 'zod';

// "Ana@Exemplo.com " e "ana@exemplo.com" são a mesma pessoa.
const email = z.string().trim().toLowerCase().pipe(z.email('E-mail inválido'));

export const cadastroSchema = z.object({
  nome: z.string().trim().min(2, 'Informe o nome').max(120),
  email,
  senha: z
    .string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres')
    // O bcrypt só considera os primeiros 72 bytes da senha.
    .refine((senha) => Buffer.byteLength(senha) <= 72, 'A senha é longa demais'),
});

export const loginSchema = z.object({
  email,
  senha: z.string().min(1, 'Informe a senha'),
});
