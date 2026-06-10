import { z } from 'zod';

export const CriarCampanhaOpcaoSchema = z.object({
  campanha_id: z.string().uuid('ID da campanha inválido'),
  descricao: z.string().min(2, 'Descrição deve ter no mínimo 2 caracteres').max(200, 'Descrição não pode ter mais de 200 caracteres')
});

export const DefinirResultadoSchema = z.object({
  opcao_id: z.string().uuid('ID da opção inválido')
});

export type CriarCampanhaOpcaoInput = z.infer<typeof CriarCampanhaOpcaoSchema>;
export type DefinirResultadoInput = z.infer<typeof DefinirResultadoSchema>;
