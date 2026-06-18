import { Router } from 'express';
import { ApostaController } from '../controller/aposta.controller';
import { validateRequest } from '../middlewares/validateSchema';
import { CriarApostaSchema } from '../schemas/aposta.schema';
import { authMiddleware } from '../middlewares/authMiddleware';
import { upload } from '../middlewares/uploads';
import { isAdmin } from '../middlewares/isAdmin';

const apostaRoutes = Router();
const apostaController = new ApostaController();

/**
 * @swagger
 * /apostas:
 *   post:
 *     summary: Registra uma nova aposta (Bilhete) em uma campanha aberta
 *     description: |
 *       O campo comprovante é opcional (arquivo de imagem ou PDF).
 *     tags:
 *       - Apostas
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - usuario_id
 *               - campanha_opcao_id
 *               - meio_pagamento_id
 *             properties:
 *               usuario_id:
 *                 type: number
 *                 example: 1
 *               campanha_opcao_id:
 *                 type: number
 *                 example: 1
 *               meio_pagamento_id:
 *                 type: number
 *                 example: 1
 *               comprovante:
 *                 type: string
 *                 format: binary
 *                 description: Arquivo (JPG, PNG, PDF) do comprovante de pagamento
 *     responses:
 *       201:
 *         description: Aposta registrada com sucesso.
 *       400:
 *         description: Erro de validação ou campanha fechada/encerrada.
 *       401:
 *         description: Token não fornecido ou inválido.
 */
apostaRoutes.post(
    '/apostas',
    authMiddleware,
    upload.single('comprovante'),
    validateRequest(CriarApostaSchema),
    apostaController.criar
);

/**
 * @swagger
 * /apostas/usuario/{idUsuario}:
 *   get:
 *     summary: Lista o histórico de apostas de um usuário específico
 *     tags:
 *       - Apostas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idUsuario
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Histórico de apostas retornado com sucesso.
 *       500:
 *         description: Erro interno ao procurar o histórico.
 */
apostaRoutes.get(
    '/apostas/usuario/:idUsuario',
    authMiddleware,
    apostaController.listarPorUsuario
);

/**
 * @swagger
 * /apostas/campanha/{idCampanha}:
 *   get:
 *     summary: Lista todas as apostas de uma campanha (apenas criador/admin)
 *     tags: [Apostas]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: idCampanha
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de apostas retornada.
 *       403:
 *         description: Apenas o criador pode ver.
 */
apostaRoutes.get(
    '/apostas/campanha/:idCampanha',
    authMiddleware,
    apostaController.listarPorCampanha
);

/**
 * @swagger
 * /apostas/{idAposta}/comprovante:
 *   patch:
 *     summary: Anexa ou substitui o comprovante de uma aposta existente
 *     tags:
 *       - Apostas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idAposta
 *         required: true
 *         schema:
 *           type: integer
 *         example: 10
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - comprovante
 *             properties:
 *               comprovante:
 *                 type: string
 *                 format: binary
 *                 description: Arquivo (JPG, PNG, PDF) do comprovante de pagamento
 *     responses:
 *       200:
 *         description: Comprovante anexado com sucesso.
 *       400:
 *         description: Nenhum arquivo enviado ou aposta inválida.
 *       401:
 *         description: Token não fornecido ou inválido.
 */
apostaRoutes.patch(
    '/apostas/:idAposta/comprovante',
    authMiddleware,
    upload.single('comprovante'),
    apostaController.anexarComprovante
);

/**
 * @swagger
 * /apostas/{idAposta}/status:
 *   patch:
 *     summary: "Atualiza o status de uma aposta"
 *     tags:
 *       - Apostas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idAposta
 *         required: true
 *         schema:
 *           type: integer
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
 *                 enum: [CONFIRMADA, REJEITADA]
 *                 example: "CONFIRMADA"
 *     responses:
 *       200:
 *         description: Status atualizado.
 *       403:
 *         description: Apenas administradores.
 */
apostaRoutes.patch(
    '/apostas/:idAposta/status',
    authMiddleware,
    apostaController.atualizarStatus
);

/**
 * @swagger
 * /apostas/{idAposta}:
 *   patch:
 *     summary: Atualiza uma aposta existente (apenas se pendente/aguardando)
 *     tags: [Apostas]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: idAposta
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               campanha_opcao_id:
 *                 type: number
 *               meio_pagamento_id:
 *                 type: number
 *               comprovante:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Aposta atualizada.
 */
apostaRoutes.patch(
    '/apostas/:idAposta',
    authMiddleware,
    upload.single('comprovante'),
    apostaController.atualizarAposta
);

export { apostaRoutes };