import { z } from 'zod';

import { STATUS_PEDIDO } from '../models/pedidoModel.js';

// Só ids e quantidades: nome, preço e total são sempre lidos do banco pela API.
export const pedidoSchema = z.object({
  endereco_id: z.number().int().positive('Informe o endereço'),
  itens: z
    .array(
      z.object({
        produto_id: z.number().int().positive(),
        quantidade: z.number().int().min(1).max(99),
      }),
    )
    .min(1, 'O pedido precisa de pelo menos um item')
    .max(50)
    .refine(
      (itens) => new Set(itens.map((item) => item.produto_id)).size === itens.length,
      'Produto repetido na lista de itens',
    ),
});

export const statusPedidoSchema = z.object({
  status: z.enum(STATUS_PEDIDO, 'Status inválido'),
});
