import { Request, Response } from 'express';
import { MeioPagamentoService } from '../service/meioPagamento.service';

const meioPagamentoService = new MeioPagamentoService();

export class MeioPagamentoController {
  async criar(req: Request, res: Response): Promise<Response> {
    try {
      const novoMeio = await meioPagamentoService.criar(req.body);
      return res.status(201).json({ success: true, data: novoMeio });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async listar(req: Request, res: Response): Promise<Response> {
    try {
      const meios = await meioPagamentoService.listarTodos();
      return res.status(200).json({ success: true, data: meios });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: 'Erro ao listar os meios de pagamento.' });
    }
  }

  async atualizarStatus(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const meioAtualizado = await meioPagamentoService.atualizarStatus(String(id), String(status));

      return res.status(200).json({
        success: true,
        message: `Status do meio de pagamento atualizado para ${status} com sucesso!`,
        data: meioAtualizado,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}