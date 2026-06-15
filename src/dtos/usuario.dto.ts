export interface CriarUsuarioInputDTO {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  senha: string;
  tipo_usuario?: string;
  status?: string;
}

export interface UsuarioOutputDTO {
  id: number;
  nome: string;
  email: string;
  status: string;
}