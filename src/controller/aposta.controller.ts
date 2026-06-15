import { Request, Response } from 'express';
import { ApostaService } from '../service/aposta.service';

const apostaService = new ApostaService();

export class ApostaController {
  async criar(req: Request, res: Response): Promise<Response> {
    try {
      const { usuario_id, campanha_opcao_id, meio_pagamento_id } = req.body;
      const comprovante = req.file ? req.file.path : undefined;

      const novaAposta = await apostaService.criar({
        usuario_id: Number(usuario_id),
        campanha_opcao_id: Number(campanha_opcao_id),
        meio_pagamento_id: Number(meio_pagamento_id),
        comprovante
      });
      return res.status(201).json({ success: true, data: novaAposta });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async listarPorUsuario(req: Request, res: Response): Promise<Response> {
    try {
      const idUsuario = Number(req.params.idUsuario);
      if (isNaN(idUsuario)) throw new Error('ID inválido');
      const apostas = await apostaService.listarPorUsuario(idUsuario);
      return res.status(200).json({ success: true, data: apostas });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async anexarComprovante(req: Request, res: Response): Promise<Response> {
    try {
      const idAposta = Number(req.params.idAposta);
      if (isNaN(idAposta)) throw new Error('ID da aposta inválido');
      if (!req.file) throw new Error('Nenhum arquivo enviado.');

      const aposta = await apostaService.anexarComprovante(idAposta, req.file.path);
      return res.status(200).json({
        success: true,
        message: 'Comprovante anexado com sucesso!',
        data: aposta
      });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async atualizarStatus(req: Request, res: Response): Promise<Response> {
    try {
      const idAposta = Number(req.params.idAposta);
      const { status } = req.body;
      const Id = (req as any).usuarioId;

      if (isNaN(idAposta)) throw new Error('ID inválido');
      if (!status) throw new Error('Status é obrigatório');

      const apostaAtualizada = await apostaService.atualizarStatus(idAposta, status, Id);

      return res.status(200).json({
        success: true,
        message: `Status da aposta atualizado para ${status} com sucesso!`,
        data: apostaAtualizada
      });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}