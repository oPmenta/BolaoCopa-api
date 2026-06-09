import { Router } from 'express';
import { ApostaController } from '../controller/aposta.controller';

const apostaRoutes = Router();
const apostaController = new ApostaController();

/**
 * @swagger
 * /apostas:
 *   post:
 *     summary: Registra uma nova aposta (Bilhete) em uma campanha aberta
 *     tags:
 *       - Apostas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario_id
 *               - campanha_opcao_id
 *               - meio_pagamento_id
 *             properties:
 *               usuario_id:
 *                 type: string
 *                 example: "id-do-usuario"
 *               campanha_opcao_id:
 *                 type: string
 *                 example: "id-da-opcao-escolhida"
 *               meio_pagamento_id:
 *                 type: string
 *                 example: "id-do-meio-de-pagamento"
 *     responses:
 *       201:
 *         description: Aposta registrada com sucesso (Status PENDENTE).
 *       400:
 *         description: Erro de validação ou campanha fechada/encerrada.
 */
apostaRoutes.post('/apostas', apostaController.criar);

/**
 * @swagger
 * /apostas/usuario/{idUsuario}:
 *   get:
 *     summary: Lista o histórico de apostas de um usuário específico
 *     tags:
 *       - Apostas
 *     parameters:
 *       - in: path
 *         name: idUsuario
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Histórico de apostas retornado com sucesso.
 *       500:
 *         description: Erro interno ao procurar o histórico.
 */
apostaRoutes.get('/apostas/usuario/:idUsuario', apostaController.listarPorUsuario);

export { apostaRoutes };