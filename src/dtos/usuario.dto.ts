export interface CriarUsuarioInputDTO {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  senha: string;
  tipo_usuario?: string;
  status?: string;
}

// AINDA NAO ESTA SENDO UTILIZADO, MAS PODE SER USADO PARA DEFINIR O FORMATO DE DADOS QUE SAEM DA API
export interface UsuarioOutputDTO {
  id: number;
  nome: string;
  email: string;
  status: string;
}