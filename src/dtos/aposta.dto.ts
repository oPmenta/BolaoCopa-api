export interface CriarApostaInputDTO {
  usuario_id: number;
  campanha_opcao_id: number;
  comprovante?: string;
}

export interface AtualizarStatusApostaInputDTO {
  status: 'CONFIRMADA' | 'REJEITADA';
}