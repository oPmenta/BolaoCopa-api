import { prisma } from '../database/prismaClient';
import { CriarMeioPagamentoInputDTO } from '../dtos/meioPagamento.dto';

export class MeioPagamentoService {
    async criar({ descricao }: CriarMeioPagamentoInputDTO) {
        if (!descricao || descricao.trim() === '') {
            throw new Error('A descrição do meio de pagamento é obrigatória.');
        }

        const descricaoFormatada = descricao.trim();

        const meioExiste = await prisma.meio_pagamento.findFirst({
            where: {
                descricao: { equals: descricaoFormatada, mode: 'insensitive' },
            },
        });

        if (meioExiste) {
            throw new Error('Este meio de pagamento já está cadastrado.');
        }

        const novoMeio = await prisma.meio_pagamento.create({
            data: {
                descricao: descricaoFormatada,
            },
        });

        return novoMeio;
    }

    async listarTodos() {
        return await prisma.meio_pagamento.findMany();
    }
}