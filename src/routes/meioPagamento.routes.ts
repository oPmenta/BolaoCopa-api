import { Router } from 'express';
import { MeioPagamentoController } from '../controller/meioPagamento.controller';

const meioPagamentoRoutes = Router();
const meioPagamentoController = new MeioPagamentoController();

/**
 * @swagger
 * /meios-pagamento:
 *   post:
 *     summary: Cadastra um novo meio de pagamento
 *     tags:
 *       - Meios de Pagamento
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
meioPagamentoRoutes.post('/meios-pagamento', meioPagamentoController.criar);

/** 
 * @swagger
 * /meios-pagamento: 
 *   get:
 *     summary: Lista todos os meios de pagamento disponíveis
 *     tags:
 *       - Meios de Pagamento
 *     responses:
 *       200:
 *         description: Lista retornada com sucesso.
 */

meioPagamentoRoutes.get('/meios-pagamento', meioPagamentoController.listar);

/**
 * @swagger
 * /meios-pagamento/{id}:
 *   patch:
 *     summary: Atualiza o status de um meio de pagamento
 *     tags:
 *       - Meios de Pagamento
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
meioPagamentoRoutes.patch('/meios-pagamento/:id', meioPagamentoController.atualizarStatus);

export { meioPagamentoRoutes };