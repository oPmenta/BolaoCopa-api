import { prisma } from '../database/prismaClient';
import { CriarUsuarioInputDTO } from '../dtos/usuario.dto';
import { AppError } from '../utils/AppError';
import { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.config';

export class UsuarioService {
  async criar(dados: CriarUsuarioInputDTO) {
    console.log('Dados recebidos no backend:', dados);
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email: dados.email }
    });

    if (usuarioExistente) {
      throw new AppError('E-mail já cadastrado.', 400);
    }

    const tipoUsuarioFormatado = dados.tipo_usuario
      ? (dados.tipo_usuario.toUpperCase().trim() as Role)
      : Role.USER;

    const senhaHash = await bcrypt.hash(dados.senha, 10);

    // Criação explícita, sem espalhar o objeto inteiro
    return await prisma.usuario.create({
      data: {
        nome: dados.nome,
        cpf: dados.cpf,
        email: dados.email,
        telefone: dados.telefone,
        senha: senhaHash,
        tipo_usuario: tipoUsuarioFormatado,
        status: dados.status || 'ATIVO'
      }
    });
  }

  async login(email: string, senha: string) {
    if (!email || !senha) {
      throw new AppError('E-mail e senha são obrigatórios.', 400);
    }

    const usuario = await prisma.usuario.findUnique({
      where: { email }
    });

    if (!usuario) {
      throw new AppError('E-mail ou senha inválidos.', 401);
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      throw new AppError('E-mail ou senha inválidos.', 401);
    }

    if (usuario.status !== 'ATIVO') {
      throw new AppError('Usuário inativo.', 403);
    }

    const token = jwt.sign(
      {
        usuarioId: usuario.id,
        nome: usuario.nome,
        tipo_usuario: usuario.tipo_usuario,
      },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn } as any
    );

    return {
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo_usuario: usuario.tipo_usuario
      }
    };
  }
}