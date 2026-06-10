import { Router } from 'express';
import { MeioPagamentoController } from '../controller/meioPagamento.controller';
import { validateRequest } from '../middlewares/validateSchema';
import { CriarMeioPagamentoSchema, AtualizarStatusMeioPagamentoSchema } from '../schemas/meioPagamento.schema';
import { authMiddleware } from '../middlewares/authMiddleware';
import { isAdmin } from '../middlewares/isAdmin';

const meioPagamentoRoutes = Router();
const meioPagamentoController = new MeioPagamentoController();

/**
 * @swagger
 * /meios-pagamento:
 *   post:
 *     summary: Cadastra um novo meio de pagamento
 *     tags:
 *       - Meios de Pagamento
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
 *                 example: "PIX"
 *     responses:
 *       201:
 *         description: Meio de pagamento criado com sucesso.
 *       400:
 *         description: Erro de validação ou duplicidade.
 */
meioPagamentoRoutes.post('/meios-pagamento', authMiddleware, isAdmin, validateRequest(CriarMeioPagamentoSchema), meioPagamentoController.criar);

/** 
 * @swagger
 * /meios-pagamento: 
 *   get:
 *     summary: Lista todos os meios de pagamento disponíveis
 *     tags:
 *       - Meios de Pagamento
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista retornada com sucesso.
 */

meioPagamentoRoutes.get('/meios-pagamento', authMiddleware, meioPagamentoController.listar);

/**
 * @swagger
 * /meios-pagamento/{id}:
 *   patch:
 *     summary: Atualiza o status de um meio de pagamento
 *     tags:
 *       - Meios de Pagamento
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
meioPagamentoRoutes.patch('/meios-pagamento/:id', authMiddleware, isAdmin, validateRequest(AtualizarStatusMeioPagamentoSchema), meioPagamentoController.atualizarStatus);

export { meioPagamentoRoutes };