import { z } from 'zod';

export const produtoSchema = z.object({
  categoria_id: z.number().int().positive('Informe a categoria'),
  nome: z.string().trim().min(2, 'Informe o nome').max(120),
  descricao: z.string().trim().max(1000).nullish(),
  preco: z.number().positive('O preço deve ser maior que zero').max(99999999),
  imagem_url: z.url('URL inválida').max(500).nullish(),
  ativo: z.boolean().optional(),
});

// Na edição, todos os campos são opcionais (ex.: { "ativo": false } só desativa).
export const produtoAtualizacaoSchema = produtoSchema.partial();
