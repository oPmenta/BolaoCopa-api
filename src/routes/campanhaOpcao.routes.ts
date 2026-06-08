import { Router } from 'express';
import { CampanhaOpcaoController } from '../controller/campanhaOpcao.controller';

const opcaoRoutes = Router();
const opcaoController = new CampanhaOpcaoController();

/**
 * @swagger
 * /campanhas/opcoes:
 *   post:
 *     summary: Cadastra uma nova opção de aposta para uma campanha
 *     tags:
 *       - Campanhas (Opções)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - campanha_id
 *               - descricao
 *             properties:
 *               campanha_id:
 *                 type: string
 *                 example: "id-da-campanha-aqui"
 *               descricao:
 *                 type: string
 *                 example: "Vitória do Brasil"
 *     responses:
 *       201:
 *         description: Opção cadastrada com sucesso.
 *       400:
 *         description: Erro de validação ou duplicidade.
 */
opcaoRoutes.post('/campanhas/opcoes', opcaoController.criar);

/**
 * @swagger
 * /campanhas/{idCampanha}/opcoes:
 *   get:
 *     summary: Lista todas as opções disponíveis de uma campanha específica
 *     tags:
 *       - Campanhas (Opções)
 *     parameters:
 *       - in: path
 *         name: idCampanha
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de opções retornada.
 */
opcaoRoutes.get('/campanhas/:idCampanha/opcoes', opcaoController.listar);

/**
 * @swagger
 * /campanhas/{idCampanha}/definir-resultado:
 *   patch:
 *     summary: Define a opção vencedora da campanha (Apenas campanhas encerradas)
 *     tags:
 *       - Campanhas (Opções)
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
 *               - opcao_id
 *             properties:
 *               opcao_id:
 *                 type: string
 *                 example: "id-da-opcao-vencedora"
 *     responses:
 *       200:
 *         description: Resultado definido com sucesso.
 *       400:
 *         description: Erro nas regras de negócio.
 */
opcaoRoutes.patch('/campanhas/:idCampanha/definir-resultado', opcaoController.definirResultado);

export { opcaoRoutes };