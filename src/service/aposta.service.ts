import { prisma } from '../database/prismaClient';
import { CriarApostaInputDTO } from '../dtos/aposta.dto';
import { ApostaStatus } from '@prisma/client';

export class ApostaService {
    async criar({ usuario_id, campanha_opcao_id, meio_pagamento_id, comprovante }: CriarApostaInputDTO) {
        if (!usuario_id || !campanha_opcao_id || !meio_pagamento_id) {
            throw new Error('Usuário, Opção da Campanha e Meio de Pagamento são obrigatórios.');
        }

        const usuarioExiste = await prisma.usuario.findUnique({
            where: { id: usuario_id },
        });
        if (!usuarioExiste) throw new Error('Usuário não encontrado.');

        const meioExiste = await prisma.meio_pagamento.findUnique({
            where: { id: meio_pagamento_id },
        });
        if (!meioExiste) throw new Error('Meio de pagamento não encontrado.');
        if (meioExiste.status !== 'ATIVO') throw new Error('Meio de pagamento indisponível.');

        const opcaoExiste = await prisma.campanha_opcao.findUnique({
            where: { id: campanha_opcao_id },
        });
        if (!opcaoExiste) throw new Error('Opção de aposta não encontrada.');

        const campanha = await prisma.campanha.findUnique({
            where: { id: opcaoExiste.campanha_id },
        });

        if (!campanha) {
            throw new Error('Campanha associada a esta opção não foi encontrada.');
        }

        if (campanha.status !== 'ABERTA') {
            throw new Error(`Não é possível apostar nesta campanha. Status atual: ${campanha.status}`);
        }

        const novaAposta = await prisma.aposta.create({
            data: {
                usuario_id,
                campanha_opcao_id,
                meio_pagamento_id,
                status: comprovante ? ApostaStatus.AGUARDANDO_VALIDACAO : ApostaStatus.PENDENTE,
                comprovante: comprovante || null,
            },
            include: {
                campanha_opcao: true,
                meio_pagamento: true,
            }
        });

        return novaAposta;
    }

    async listarPorUsuario(usuario_id: number) {
        return await prisma.aposta.findMany({
            where: { usuario_id },
            include: {
                campanha_opcao: {
                    include: {
                        campanha: true
                    }
                },
                meio_pagamento: true,
            },
            orderBy: { dt_criacao: 'desc' },
        });
    }

    async anexarComprovante(id: number, comprovantePath: string) {
        const aposta = await prisma.aposta.findUnique({ where: { id } });
        if (!aposta) throw new Error('Aposta não encontrada.');

        if (aposta.status !== 'PENDENTE') {
            throw new Error('Não é possível anexar comprovante a uma aposta já processada.');
        }

        return await prisma.aposta.update({
            where: { id },
            data: {
                comprovante: comprovantePath,
                status: ApostaStatus.AGUARDANDO_VALIDACAO
            }
        });
    }

    async atualizarStatus(id: number, novoStatus: ApostaStatus, usuarioId: number) {

        const aposta = await prisma.aposta.findUnique({ where: { id } });
        if (!aposta) throw new Error('Aposta não encontrada.');

        const campanha = await prisma.campanha.findUnique({ where: { id } });
        if (!campanha) throw new Error('Campanha não encontrada.');

        if (campanha.criador_id !== usuarioId) {
            throw new Error('Apenas o criador da campanha pode alterar o status.');
        }

        const statusPermitidos = ['CONFIRMADA', 'REJEITADA'];

        if (novoStatus !== ApostaStatus.CONFIRMADA && novoStatus !== ApostaStatus.REJEITADA) {
            throw new Error('Status inválido. Use CONFIRMADA ou REJEITADA.');
        }
        return await prisma.aposta.update({
            where: { id },
            data: { status: novoStatus }
        });
    }
}