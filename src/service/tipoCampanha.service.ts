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

  async atualizarStatus(id: string, novoStatus: string) {
    if (!id || !novoStatus) {
      throw new Error('ID e status são obrigatórios.');
    }

    const tipoExiste = await prisma.tipo_campanha.findUnique({
      where: { id },
    });

    if (!tipoExiste) {
      throw new Error('Tipo de campanha não encontrado.');
    }

    return await prisma.tipo_campanha.update({
      where: { id },
      data: { status: novoStatus.toUpperCase().trim() },
    });
  }
}