import { Request, Response } from 'express';
import { CampanhaService } from '../service/campanha.service';

const campanhaService = new CampanhaService();

export class CampanhaController {
    async criar(req: Request, res: Response): Promise<Response> {
        try {
            const novaCampanha = await campanhaService.criar(req.body);

            return res.status(201).json({
                success: true,
                message: 'Campanha criada com sucesso e aberta para captação!',
                data: novaCampanha
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async listarTodas(req: Request, res: Response): Promise<Response> {
        try {
            const campanhas = await campanhaService.listarTodas();
            return res.status(200).json({
                success: true,
                data: campanhas
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: 'Erro interno ao listar as campanhas.'
            });
        }
    }

    async listarPublicas(req: Request, res: Response): Promise<Response> {
        try {
            const campanhasPublicas = await campanhaService.listarApenasPublicas();
            return res.status(200).json({
                success: true,
                data: campanhasPublicas
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: 'Erro interno ao listar as campanhas públicas.'
            });
        }
    }

    async buscarPorCodigo(req: Request, res: Response): Promise<Response> {
        try {
            const { codigo } = req.params;
            const campanha = await campanhaService.buscarPorCodigo(String(codigo));
            return res.status(200).json({ success: true, data: campanha });
        } catch (error: any) {
            return res.status(404).json({ success: false, message: error.message });
        }
    }

    async atualizarStatus(req: Request, res: Response): Promise<Response> {
        try {
            const idCampanha = Number(req.params.idCampanha);
            const { status } = req.body;
            const usuarioId = (req as any).usuarioId;

            if (isNaN(idCampanha)) throw new Error('ID inválido');

            const campanha = await campanhaService.atualizarStatus(idCampanha, status, usuarioId);

            return res.status(200).json({
                success: true,
                message: `Status da campanha atualizado para ${status} com sucesso!`,
                data: campanha,
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
}