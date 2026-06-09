import { Request, Response } from 'express';
import { UsuarioService } from '../service/usuario.service';

const usuarioService = new UsuarioService();

export class UsuarioController {
  async criar(req: Request, res: Response): Promise<Response> {
    try {
      const { nome, cpf, email, telefone, tipo_usuario, senha, status } = req.body;

      const novoUsuario = await usuarioService.criar({
        nome,
        cpf,
        email,
        telefone,
        tipo_usuario,
        senha,
        status
      });

      return res.status(201).json({
        success: true,
        message: 'Usuário cadastrado com sucesso!',
        data: novoUsuario
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 400;
      return res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }
}