import { prisma } from '../database/prismaClient';
import { CriarUsuarioInputDTO } from '../dtos/usuario.dto';
import { AppError } from '../utils/AppError';

export class UsuarioService {
  async criar(dados: CriarUsuarioInputDTO) {
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email: dados.email }
    });

    if (usuarioExistente) {
      throw new AppError('E-mail já cadastrado.', 400);
    }

    return await prisma.usuario.create({ data: dados });
  }
}