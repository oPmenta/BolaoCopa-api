import { Router } from 'express';
import { UsuarioController } from '../controller/usuario.controller';
import { validateRequest } from '../middlewares/validateSchema';
import { CriarUsuarioSchema, LoginSchema } from '../schemas/usuario.schema';

const usuarioRoutes = Router();
const usuarioController = new UsuarioController();

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: "Cria um novo usuário"
 *     tags: 
 *       - Usuário  
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - cpf
 *               - email
 *               - telefone
 *               - senha
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "Fulano de Tal"
 *               cpf:
 *                 type: string
 *                 example: "123.456.789-00"
 *               email:
 *                 type: string
 *                 example: "fulano@email.com"
 *               telefone:
 *                 type: string
 *                 example: "(34) 99999-9999"
 *               tipo_usuario:
 *                 type: string
 *                 enum: [ADMIN, USER]
 *                 default: "USER"
 *                 example: "USER"
 *               senha:
 *                 type: string
 *                 example: "senhaSegura123"
 *               status:
 *                 type: string
 *                 default: "ATIVO"
 *                 example: "ATIVO"
 *     responses:
 *       201:
 *         description: "Usuário criado com sucesso"
 *       400:
 *         description: "Erro de validação (ex: e-mail já cadastrado)"
 *       500:
 *         description: "Erro interno do servidor"
 */
usuarioRoutes.post('/usuarios', validateRequest(CriarUsuarioSchema), usuarioController.criar);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: "Realiza o login de um usuário e retorna um token JWT"
 *     tags: 
 *       - Autenticação  
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 example: "fulano@email.com"
 *               senha:
 *                 type: string
 *                 example: "senhaSegura123"
 *     responses:
 *       200:
 *         description: "Login realizado com sucesso. Retorna token JWT."
 *       401:
 *         description: "E-mail ou senha inválidos"
 *       400:
 *         description: "E-mail e senha são obrigatórios"
 */
usuarioRoutes.post('/login', validateRequest(LoginSchema), usuarioController.login);

export { usuarioRoutes };