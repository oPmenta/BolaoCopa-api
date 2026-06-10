import { z } from 'zod';

export const CriarTipoCampanhaSchema = z.object({
  descricao: z.string().min(3, 'Descrição deve ter no mínimo 3 caracteres').max(100, 'Descrição não pode ter mais de 100 caracteres')
});

export const AtualizarStatusTipoCampanhaSchema = z.object({
  status: z.string().refine(
    (val) => ['ATIVO', 'INATIVO'].includes(val),
    { message: 'Status deve ser ATIVO ou INATIVO' }
  )
});

export type CriarTipoCampanhaInput = z.infer<typeof CriarTipoCampanhaSchema>;
export type AtualizarStatusTipoCampanhaInput = z.infer<typeof AtualizarStatusTipoCampanhaSchema>;
