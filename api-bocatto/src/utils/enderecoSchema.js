import { z } from 'zod';

export const enderecoSchema = z.object({
  rua: z.string().trim().min(2, 'Informe a rua').max(150),
  numero: z.string().trim().min(1, 'Informe o número').max(20),
  complemento: z.string().trim().max(100).nullish(),
  bairro: z.string().trim().min(2, 'Informe o bairro').max(100),
  cidade: z.string().trim().min(2, 'Informe a cidade').max(100),
  // Aceita "89800-000" ou "89800000"; guarda só os dígitos.
  cep: z
    .string()
    .trim()
    .regex(/^\d{5}-?\d{3}$/, 'CEP inválido')
    .transform((cep) => cep.replace('-', '')),
});

// Na edição, todos os campos são opcionais.
export const enderecoAtualizacaoSchema = enderecoSchema.partial();
