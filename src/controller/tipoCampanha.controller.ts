import { Request, Response } from 'express';
import { TipoCampanhaService } from '../service/tipoCampanha.service';

const tipoCampanhaService = new TipoCampanhaService();

export class TipoCampanhaController {
  async criar(req: Request, res: Response): Promise<Response> {
    try {
      const { descricao } = req.body;

      const novoTipo = await tipoCampanhaService.criar({ descricao });

      return res.status(201).json({
        success: true,
        message: 'Tipo de campanha cadastrado com sucesso!',
        data: novoTipo
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async listar(req: Request, res: Response): Promise<Response> {
    try {
      const tipos = await tipoCampanhaService.listarTodos();
      
      return res.status(200).json({
        success: true,
        data: tipos
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Erro interno ao buscar os tipos de campanha.'
      });
    }
  }

  async atualizarStatus(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const tipoAtualizado = await tipoCampanhaService.atualizarStatus(String(id), String(status));

      return res.status(200).json({
        success: true,
        message: `Status do tipo de campanha atualizado para ${status} com sucesso!`,
        data: tipoAtualizado,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}