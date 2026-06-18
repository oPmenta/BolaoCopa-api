import { Router } from 'express';
import { TipoCampanhaController } from '../controller/tipoCampanha.controller';
import { validateRequest } from '../middlewares/validateSchema';
import { CriarTipoCampanhaSchema, AtualizarStatusTipoCampanhaSchema } from '../schemas/tipoCampanha.schema';
import { authMiddleware } from '../middlewares/authMiddleware';

const tipoCampanhaRoutes = Router();
const tipoCampanhaController = new TipoCampanhaController();

/**
 * @swagger
 * /tipos-campanha:
 *   post:
 *     summary: Cadastra um novo tipo de campanha
 *     tags:
 *       - Tipos de Campanha
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - descricao
 *             properties:
 *               descricao:
 *                 type: string
 *                 example: "Futebol"
 *     responses:
 *       201:
 *         description: Tipo de campanha criado com sucesso!
 *       400:
 *         description: "Erro de validação (ex: descrição vazia)"
 *       500:
 *         description: Erro interno do servidor
 */
tipoCampanhaRoutes.post('/tipos-campanha', authMiddleware, validateRequest(CriarTipoCampanhaSchema), tipoCampanhaController.criar);

/**
 * @swagger
 * /listar-tipos-campanha:
 *   get:
 *     summary: Lista todos os tipos de campanha cadastrados
 *     tags:
 *       - Tipos de Campanha
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista retornada com sucesso!
 *       500:
 *         description: Erro interno do servidor
 */
tipoCampanhaRoutes.get('/listar-tipos-campanha', authMiddleware, tipoCampanhaController.listar);

/**
 * @swagger
 * /tipos-campanha/{id}:
 *   patch:
 *     summary: Atualiza o status de um tipo de campanha
 *     tags:
 *       - Tipos de Campanha
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *                 enum: [ATIVO, INATIVO]
 *                 example: "INATIVO"
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso.
 *       400:
 *         description: Erro ao atualizar o status.
 */
tipoCampanhaRoutes.patch('/tipos-campanha/:id', authMiddleware, validateRequest(AtualizarStatusTipoCampanhaSchema), tipoCampanhaController.atualizarStatus);

export { tipoCampanhaRoutes };