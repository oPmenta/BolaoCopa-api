import { z } from 'zod';

export const DefinirResultadoSchema = z.object({
  opcao_id: z.coerce.number().int().positive('ID da opção deve ser um número positivo')
});

export type DefinirResultadoInput = z.infer<typeof DefinirResultadoSchema>;
