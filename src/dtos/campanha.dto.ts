export interface CriarCampanhaInputDTO {
  nome: string;
  dt_fim: Date | string;
  taxa_operacional: number;
  valor_bolao: number;
  codigo_campanha: string;
  tipo_campanha_id: number;
  criador_id: number;
  opcoes: string[];
}