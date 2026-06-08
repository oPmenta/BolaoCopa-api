import { prisma } from '../database/prismaClient';
import { CriarCampanhaOpcaoInputDTO, DefinirResultadoInputDTO } from '../dtos/campanhaOpcao.dto';

export class CampanhaOpcaoService {
  async criar({ campanha_id, descricao }: CriarCampanhaOpcaoInputDTO) {
    if (!campanha_id || !descricao || descricao.trim() === '') {
      throw new Error('Campanha ID e descrição são obrigatórios.');
    }

    const campanhaExiste = await prisma.campanha.findUnique({
      where: { id: campanha_id },
    });

    if (!campanhaExiste) {
      throw new Error('A campanha informada não existe.');
    }

    const opcaoDuplicada = await prisma.campanha_opcao.findFirst({
      where: {
        campanha_id,
        descricao: { equals: descricao.trim(), mode: 'insensitive' },
      },
    });

    if (opcaoDuplicada) {
      throw new Error('Esta opção já está cadastrada para esta campanha.');
    }

    const novaOpcao = await prisma.campanha_opcao.create({
      data: {
        campanha_id,
        descricao: descricao.trim(),
        status: 'ATIVO',
        eh_resultado_final: false,
      },
    });

    return novaOpcao;
  }

  async definirVencedor({ campanha_id, opcao_id }: DefinirResultadoInputDTO) {
    const campanha = await prisma.campanha.findUnique({
      where: { id: campanha_id },
    });

    if (!campanha) {
      throw new Error('Campanha não encontrada.');
    }

    if (campanha.status !== 'ENCERRADA') {
      throw new Error('A campanha precisa estar com o status ENCERRADA para definir o resultado final.');
    }

    const opcao = await prisma.campanha_opcao.findUnique({
      where: { id: opcao_id },
    });

    if (!opcao || opcao.campanha_id !== campanha_id) {
      throw new Error('A opção informada não pertence a esta campanha.');
    }

    return await prisma.$transaction(async (tx) => {
      await tx.campanha_opcao.updateMany({
        where: { campanha_id },
        data: { eh_resultado_final: false },
      });

      const opcaoVencedora = await tx.campanha_opcao.update({
        where: { id: opcao_id },
        data: { eh_resultado_final: true },
      });

      return opcaoVencedora;
    });
  }

  async listarPorCampanha(campanha_id: string) {
    return await prisma.campanha_opcao.findMany({
      where: { campanha_id },
    });
  }
}