import { prisma } from '../database/prismaClient';
import { DefinirResultadoInputDTO } from '../dtos/campanhaOpcao.dto';

export class CampanhaOpcaoService {
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

    // 🔥 VERIFICA SE JÁ EXISTE UM RESULTADO DEFINIDO
    const resultadoExistente = await prisma.campanha_opcao.findFirst({
      where: {
        campanha_id,
        eh_resultado_final: true,
      },
    });

    if (resultadoExistente) {
      throw new Error('O resultado já foi definido e não pode ser alterado.');
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

  async listarPorCampanha(campanha_id: number) {
    const opcoes = await prisma.campanha_opcao.findMany({
      where: { campanha_id },
    });
    return opcoes.map(op => ({
      ...op,
      ehVencedora: op.eh_resultado_final,
    }));
  }
}