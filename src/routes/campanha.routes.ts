import { Router } from 'express';
import { CampanhaController } from '../controller/campanha.controller';

const campanhaRoutes = Router();
const campanhaController = new CampanhaController();

/**
 * @swagger
 * /campanhas:
 *   post:
 *     summary: Cria uma nova campanha de apostas
 *     tags:
 *       - Campanhas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - dt_inicio
 *               - dt_fim
 *               - taxa_operacional
 *               - valor_bolao
 *               - codigo_campanha
 *               - tipo_campanha_id
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "Quem será o campeão da Copa 2026?"
 *               dt_inicio:
 *                 type: string
 *                 example: "2026-06-10T12:00:00Z"
 *               dt_fim:
 *                 type: string
 *                 example: "2026-07-10T18:00:00Z"
 *               taxa_operacional:
 *                 type: number
 *                 example: 10.50
 *               valor_bolao:
 *                 type: number
 *                 example: 50.00
 *               codigo_campanha:
 *                 type: string
 *                 example: "COPA2026"
 *               tipo_campanha_id:
 *                 type: string
 *                 example: "cole-aqui-o-id-do-tipo"
 *     responses:
 *       201:
 *         description: Campanha criada com sucesso!
 *       400:
 *         description: "Erro de validação (ex: datas inválidas ou código duplicado)"
 *       500:
 *         description: Erro interno do servidor
 */
campanhaRoutes.post('/campanhas', campanhaController.criar);

/**
 * @swagger
 * /campanhas:
 *   get:
 *     summary: Lista todas as campanhas com seus respectivos tipos
 *     tags:
 *       - Campanhas
 *     responses:
 *       200:
 *         description: Campanhas listadas com sucesso!
 *       500:
 *         description: Erro interno do servidor
 */
campanhaRoutes.get('/campanhas', campanhaController.listar);

/**
 * @swagger
 * /campanhas/{idCampanha}/status:
 *   patch:
 *     summary: Atualiza o status de uma campanha (ABERTA, FECHADA, ENCERRADA)
 *     tags:
 *       - Campanhas
 *     parameters:
 *       - in: path
 *         name: idCampanha
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [ABERTA, FECHADA, ENCERRADA]
 *                 example: "ENCERRADA"
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso.
 *       400:
 *         description: Erro de validação ou ID não encontrado.
 */
campanhaRoutes.patch('/campanhas/:idCampanha/status', campanhaController.atualizarStatus);

export { campanhaRoutes };