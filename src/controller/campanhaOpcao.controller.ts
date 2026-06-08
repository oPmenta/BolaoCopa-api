import { Request, Response } from 'express';
import { CampanhaOpcaoService } from '../service/campanhaOpcao.service';

const opcaoService = new CampanhaOpcaoService();

export class CampanhaOpcaoController {
  async criar(req: Request, res: Response): Promise<Response> {
    try {
      const novaOpcao = await opcaoService.criar(req.body);
      return res.status(201).json({ success: true, data: novaOpcao });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async definirResultado(req: Request, res: Response): Promise<Response> {
    try {
      const { idCampanha } = req.params;
      const { opcao_id } = req.body;

      const resultado = await opcaoService.definirVencedor({
        campanha_id: String(idCampanha),
        opcao_id: String(opcao_id),
      });

      return res.status(200).json({
        success: true,
        message: 'Resultado final definido com sucesso!',
        data: resultado,
      });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async listar(req: Request, res: Response): Promise<Response> {
    try {
      const { idCampanha } = req.params;
      const opcoes = await opcaoService.listarPorCampanha(String(idCampanha));
      return res.status(200).json({ success: true, data: opcoes });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}