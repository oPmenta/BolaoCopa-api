import { Router } from 'express';
import { CampanhaOpcaoController } from '../controller/campanhaOpcao.controller';
import { validateRequest } from '../middlewares/validateSchema';
import { DefinirResultadoSchema } from '../schemas/campanhaOpcao.schema';

const opcaoRoutes = Router();
const opcaoController = new CampanhaOpcaoController();

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
 *           type: number
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
 *                 type: number
 *                 example: 1
 *     responses:
 *       200:
 *         description: Resultado definido com sucesso.
 *       400:
 *         description: Erro nas regras de negócio.
 */
opcaoRoutes.patch('/campanhas/:idCampanha/definir-resultado', validateRequest(DefinirResultadoSchema), opcaoController.definirResultado);

export { opcaoRoutes };