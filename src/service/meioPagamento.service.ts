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
        const meios = await prisma.meio_pagamento.findMany();
        return meios.map(m => ({
            ...m,
            ativo: m.status === 'ATIVO'
        }));
    }

    async atualizarStatus(id: number, novoStatus: string) {
        if (!id || !novoStatus) {
            throw new Error('ID e status são obrigatórios.');
        }

        const meioExiste = await prisma.meio_pagamento.findUnique({
            where: { id },
        });

        if (!meioExiste) {
            throw new Error('Meio de pagamento não encontrado.');
        }

        return await prisma.meio_pagamento.update({
            where: { id },
            data: { status: novoStatus.toUpperCase().trim() },
        });
    }
}