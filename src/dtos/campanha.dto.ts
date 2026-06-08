export interface CriarCampanhaInputDTO {
  nome: string;
  dt_inicio: string;
  dt_fim: string;
  taxa_operacional: number;
  valor_bolao: number;
  codigo_campanha: string;
  tipo_campanha_id: string;
}