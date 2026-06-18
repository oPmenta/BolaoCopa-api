import { z } from 'zod';

export const CriarCampanhaSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  dt_fim: z.string().datetime('Data de fim inválida'),
  taxa_operacional: z.number().min(0, 'Taxa operacional não pode ser negativa'),
  valor_bolao: z.number().min(0.01, 'Valor do bolão deve ser maior que 0'),
  codigo_campanha: z.string().min(3, 'Código deve ter no mínimo 3 caracteres'),
  tipo_campanha_id: z.coerce.number().int().positive('ID do tipo de campanha inválido'),
  opcoes: z.array(z.string().min(2, 'Cada opção deve ter no mínimo 2 caracteres'))
    .min(2, 'É necessário pelo menos 2 opções para a campanha'),
  chave_pix: z.string().min(3, 'Chave PIX é obrigatória'),
});

export const AtualizarStatusCampanhaSchema = z.object({
  status: z.string().refine(
    (val) => ['ABERTA', 'FECHADA', 'ENCERRADA'].includes(val),
    { message: 'Status deve ser ABERTA, FECHADA ou ENCERRADA' }
  )
});

export type CriarCampanhaInput = z.infer<typeof CriarCampanhaSchema>;
export type AtualizarStatusCampanhaInput = z.infer<typeof AtualizarStatusCampanhaSchema>;