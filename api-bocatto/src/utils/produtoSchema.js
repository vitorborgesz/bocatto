import { z } from 'zod';

export const produtoSchema = z.object({
  categoria_id: z.number().int().positive('Informe a categoria'),
  nome: z.string().trim().min(2, 'Informe o nome').max(120),
  descricao: z.string().trim().max(1000).nullish(),
  preco: z.number().positive('O preço deve ser maior que zero').max(99999999),
  // Link externo (https://...) ou foto do próprio site, em front-bocatto/public ("/images/produtos/x.jpg").
  imagem_url: z
    .union([z.url({ protocol: /^https?$/ }), z.string().regex(/^\/(?!\/)(?!.*\.\.)[\w\-./]+$/)], 'Use um link http(s) ou um caminho como /images/produtos/foto.jpg')
    .pipe(z.string().max(500))
    .nullish(),
  ativo: z.boolean().optional(),
});

// Na edição, todos os campos são opcionais (ex.: { "ativo": false } só desativa).
export const produtoAtualizacaoSchema = produtoSchema.partial();
