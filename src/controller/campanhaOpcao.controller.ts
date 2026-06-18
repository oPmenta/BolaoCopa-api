import { Request, Response } from 'express';
import { CampanhaOpcaoService } from '../service/campanhaOpcao.service';

const opcaoService = new CampanhaOpcaoService();

export class CampanhaOpcaoController {
  async definirResultado(req: Request, res: Response): Promise<Response> {
    try {
      const idCampanha = Number(req.params.idCampanha);
      const { opcao_id } = req.body;

      if (isNaN(idCampanha)) {
        return res.status(400).json({ success: false, message: 'ID da campanha inválido' });
      }

      if (!opcao_id || isNaN(Number(opcao_id))) {
        return res.status(400).json({ success: false, message: 'ID da opção inválido' });
      }

      const resultado = await opcaoService.definirVencedor({
        campanha_id: idCampanha,
        opcao_id: Number(opcao_id),
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
      const idCampanha = Number(req.params.idCampanha);
      if (isNaN(idCampanha)) {
        return res.status(400).json({ success: false, message: 'ID da campanha inválido' });
      }
      const opcoes = await opcaoService.listarPorCampanha(idCampanha);
      return res.status(200).json({ success: true, data: opcoes });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}