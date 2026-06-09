import { Request, Response } from 'express';
import { ApostaService } from '../service/aposta.service';

const apostaService = new ApostaService();

export class ApostaController {
  async criar(req: Request, res: Response): Promise<Response> {
    try {
      const novaAposta = await apostaService.criar(req.body);
      return res.status(201).json({ success: true, data: novaAposta });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async listarPorUsuario(req: Request, res: Response): Promise<Response> {
    try {
      const { idUsuario } = req.params;
      const apostas = await apostaService.listarPorUsuario(String(idUsuario));
      return res.status(200).json({ success: true, data: apostas });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}