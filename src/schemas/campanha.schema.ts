import { z } from 'zod';

export const CriarCampanhaSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  dt_inicio: z.string().datetime('Data de início inválida'),
  dt_fim: z.string().datetime('Data de fim inválida'),
  taxa_operacional: z.number().min(0, 'Taxa operacional não pode ser negativa'),
  valor_bolao: z.number().min(0.01, 'Valor do bolão deve ser maior que 0'),
  codigo_campanha: z.string().min(3, 'Código deve ter no mínimo 3 caracteres'),
  tipo_campanha_id: z.string().uuid('ID do tipo de campanha inválido'),
  criador_id: z.string().uuid('ID do criador inválido'),
  privacidade: z.boolean().optional().default(false)
});

export const AtualizarStatusCampanhaSchema = z.object({
  status: z.string().refine(
    (val) => ['ABERTA', 'ENCERRADA', 'CANCELADA'].includes(val),
    { message: 'Status deve ser ABERTA, ENCERRADA ou CANCELADA' }
  )
});

export type CriarCampanhaInput = z.infer<typeof CriarCampanhaSchema>;
export type AtualizarStatusCampanhaInput = z.infer<typeof AtualizarStatusCampanhaSchema>;
