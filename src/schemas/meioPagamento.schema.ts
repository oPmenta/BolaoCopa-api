import { z } from 'zod';

export const CriarMeioPagamentoSchema = z.object({
  descricao: z.string().min(2, 'Descrição deve ter no mínimo 2 caracteres').max(100, 'Descrição não pode ter mais de 100 caracteres')
});

export const AtualizarStatusMeioPagamentoSchema = z.object({
  status: z.string().refine(
    (val) => ['ATIVO', 'INATIVO'].includes(val),
    { message: 'Status deve ser ATIVO ou INATIVO' }
  )
});

export type CriarMeioPagamentoInput = z.infer<typeof CriarMeioPagamentoSchema>;
export type AtualizarStatusMeioPagamentoInput = z.infer<typeof AtualizarStatusMeioPagamentoSchema>;
