import { Router } from 'express';
import { UsuarioController } from '../controller/usuario.controller';

const usuarioRoutes = Router();
const usuarioController = new UsuarioController();

/**
 * @swagger
 * /usuarios:
 *  post:
 *    summary: Cria um novo usuário
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              nome:
 *                type: string
 *              cpf:
 *                type: string
 *              email:
 *                type: string
 *              telefone:
 *                type: string
 *              tipo_usuario:
 *                type: string
 *              senha:
 *                type: string
 *              status:
 *                type: string
 *    responses:
 *      201:
 *        description: Usuário criado com sucesso
 *      500:
 *        description: Erro interno do servidor
 */
usuarioRoutes.post('/usuarios', usuarioController.criar);

export { usuarioRoutes };