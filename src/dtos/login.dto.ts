export interface LoginInputDTO {
  email: string;
  senha: string;
}

export interface LoginOutputDTO {
  token: string;
  usuario: {
    id: string;
    nome: string;
    email: string;
    tipo_usuario: string;
  };
}
