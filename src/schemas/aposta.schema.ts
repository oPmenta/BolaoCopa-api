import { z } from 'zod';

export const CriarApostaSchema = z.object({
  usuario_id: z.coerce.number().int().positive(),
  campanha_opcao_id: z.coerce.number().int().positive(),
  meio_pagamento_id: z.coerce.number().int().positive()
});

export type CriarApostaInput = z.infer<typeof CriarApostaSchema>;