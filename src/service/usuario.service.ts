import { prisma } from '../database/prismaClient';
import { CriarUsuarioInputDTO } from '../dtos/usuario.dto';
import { AppError } from '../utils/AppError';
import { Role } from '@prisma/client';

export class UsuarioService {
  async criar(dados: CriarUsuarioInputDTO) {
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email: dados.email }
    });

    if (usuarioExistente) {
      throw new AppError('E-mail já cadastrado.', 400);
    }

    const tipoUsuarioFormatado = dados.tipo_usuario 
      ? (dados.tipo_usuario.toUpperCase().trim() as Role) 
      : Role.USER;

    return await prisma.usuario.create({ 
      data: {
        ...dados,
        tipo_usuario: tipoUsuarioFormatado
      } 
    });
  }
}