import { prisma } from '../database/prismaClient';
import { CriarTipoCampanhaInputDTO } from '../dtos/tipoCampanha.dto';

export class TipoCampanhaService {
  async criar({ descricao }: CriarTipoCampanhaInputDTO) {
    if (!descricao || descricao.trim() === '') {
      throw new Error('A descrição do tipo de campanha é obrigatória.');
    }

    const novoTipo = await prisma.tipo_campanha.create({
      data: {
        descricao: descricao.trim(),
      },
    });

    return novoTipo;
  }

  async listarTodos() {
    return await prisma.tipo_campanha.findMany();
  }
}