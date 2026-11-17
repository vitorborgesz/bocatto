import { z } from 'zod';

export const categoriaSchema = z.object({
  nome: z.string().trim().min(2, 'Informe o nome').max(60),
});
