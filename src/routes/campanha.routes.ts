import { Router } from 'express';
import { CampanhaController } from '../controller/campanha.controller';
import { validateRequest } from '../middlewares/validateSchema';
import { CriarCampanhaSchema, AtualizarStatusCampanhaSchema } from '../schemas/campanha.schema';
import { authMiddleware } from '../middlewares/authMiddleware'; 
import { isAdmin } from '../middlewares/isAdmin';

const campanhaRoutes = Router();
const campanhaController = new CampanhaController();

/**
 * @swagger
 * /campanhas:
 *   post:
 *     summary: "Cria uma nova campanha/bolão com suas opções de aposta"
 *     tags:
 *       - Campanhas
 *     security:
 *       - bearerAuth: []
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
 *               - criador_id
 *               - opcoes
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "Bolão da Copa do Mundo 2026"
 *               dt_inicio:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-06-10T15:00:00Z"
 *               dt_fim:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-06-10T18:00:00Z"
 *               taxa_operacional:
 *                 type: number
 *                 example: 5.0
 *               valor_bolao:
 *                 type: number
 *                 example: 20.0
 *               codigo_campanha:
 *                 type: string
 *                 example: "BOLAO-COPA"
 *               tipo_campanha_id:
 *                 type: number
 *                 example: 1
 *               criador_id:
 *                 type: number
 *                 example: 1
 *               privacidade:
 *                 type: boolean
 *                 default: false
 *                 example: false
 *               opcoes:
 *                 type: array
 *                 items:
 *                   type: string
 *                 minItems: 2
 *                 example: ["Vitória do Brasil", "Vitória da Argentina", "Empate"]
 *     responses:
 *       201:
 *         description: "Campanha e opções criadas com sucesso."
 *       400:
 *         description: "Erros de validação (ex: datas incorretas, código duplicado, menos de 2 opções)."
 */
campanhaRoutes.post('/campanhas', authMiddleware, validateRequest(CriarCampanhaSchema), campanhaController.criar);

/**
 * @swagger
 * /campanhas:
 *   get:
 *     summary: "Lista todas as campanhas existentes (Visão geral do Admin)"
 *     tags:
 *       - Campanhas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "Campanhas listadas com sucesso!"
 *       500:
 *         description: "Erro interno do servidor"
 */
campanhaRoutes.get('/campanhas', authMiddleware, isAdmin, campanhaController.listarTodas);

/**
 * @swagger
 * /campanhas/publicas:
 *   get:
 *     summary: "Lista apenas as campanhas públicas e abertas"
 *     tags:
 *       - Campanhas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "Campanhas públicas localizadas com sucesso!"
 *       500:
 *         description: "Erro interno do servidor"
 */
campanhaRoutes.get('/campanhas/publicas', authMiddleware, campanhaController.listarPublicas);

/**
 * @swagger
 * /campanhas/codigo/{codigo}:
 *   get:
 *     summary: "Busca uma campanha privada pelo código de convite"
 *     tags:
 *       - Campanhas
 *     security:
 *     - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: codigo
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Campanha localizada com sucesso."
 *       404:
 *         description: "Código de convite não encontrado."
 */
campanhaRoutes.get('/campanhas/codigo/:codigo', authMiddleware, campanhaController.buscarPorCodigo);

/**
 * @swagger
 * /campanhas/{idCampanha}/status:
 *   patch:
 *     summary: "Atualiza o status de uma campanha (ABERTA, FECHADA, ENCERRADA)"
 *     tags:
 *       - Campanhas
 *     security:
 *       - bearerAuth: []
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
 *         description: "Status updated successfully."
 *       400:
 *         description: "Erro de validação ou ID não encontrado."
 */
campanhaRoutes.patch('/campanhas/:idCampanha/status', authMiddleware, validateRequest(AtualizarStatusCampanhaSchema), campanhaController.atualizarStatus);

export { campanhaRoutes };