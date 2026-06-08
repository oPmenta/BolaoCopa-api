import { Request, Response } from 'express';
import { UsuarioService } from '../service/usuario.service';

const usuarioService = new UsuarioService();

export class UsuarioController {
  async criar(req: Request, res: Response): Promise<void> {
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

    res.status(201).json(novoUsuario);
  }
}