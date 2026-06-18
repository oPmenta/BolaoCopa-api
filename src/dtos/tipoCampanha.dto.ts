export interface CriarTipoCampanhaInputDTO {
  descricao: string;
  status?: string;
}

export interface TipoCampanhaOutputDTO {
  id: string;
  descricao: string;
}