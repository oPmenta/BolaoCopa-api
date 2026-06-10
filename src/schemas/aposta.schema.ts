import { z } from 'zod';

export const CriarApostaSchema = z.object({
  usuario_id: z.string().uuid('ID do usuário inválido'),
  campanha_opcao_id: z.string().uuid('ID da opção de campanha inválido'),
  meio_pagamento_id: z.string().uuid('ID do meio de pagamento inválido')
});

export type CriarApostaInput = z.infer<typeof CriarApostaSchema>;
