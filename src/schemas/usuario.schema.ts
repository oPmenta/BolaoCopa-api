import { z } from 'zod';

export const CriarUsuarioSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido. Use formato: 123.456.789-00'),
  email: z.string().email('E-mail inválido'),
  telefone: z.string().min(10, 'Telefone inválido'),
  senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  tipo_usuario: z.enum(['ADMIN', 'USER']).optional().default('USER'),
  status: z.string().optional().default('ATIVO')
});

export const LoginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(1, 'Senha é obrigatória')
});

export type CriarUsuarioInput = z.infer<typeof CriarUsuarioSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
