import { prisma } from '../database/prismaClient';
import { CriarApostaInputDTO } from '../dtos/aposta.dto';
import { DefinirResultadoInputDTO } from '../dtos/campanhaOpcao.dto';
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

        const apostaExistente = await prisma.aposta.findFirst({
            where: {
                usuario_id,
                campanha_opcao: {
                    campanha_id: campanha.id,
                },
                status: {
                    in: ['PENDENTE', 'AGUARDANDO_VALIDACAO', 'CONFIRMADA'],
                },
            },
        });

        if (apostaExistente) {
            if (apostaExistente.status === 'CONFIRMADA') {
                throw new Error('Você já possui uma aposta confirmada nesta campanha e não pode fazer outra.');
            } else {
                throw new Error('Você já possui uma aposta ativa nesta campanha. Aguarde a validação ou edite-a.');
            }
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
        const apostas = await prisma.aposta.findMany({
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

        return apostas.map(aposta => ({
            ...aposta,
            idCampanha: aposta.campanha_opcao.campanha.id,
            idOpcao: aposta.campanha_opcao.id,
            opcao: aposta.campanha_opcao,
            campanha: aposta.campanha_opcao.campanha,
        }));
    }

    async listarPorCampanha(campanhaId: number) {
        const apostas = await prisma.aposta.findMany({
            where: {
                campanha_opcao: {
                    campanha_id: campanhaId,
                },
            },
            include: {
                usuario: {
                    select: {
                        id: true,
                        nome: true,
                        email: true,
                    },
                },
                campanha_opcao: {
                    select: {
                        id: true,
                        descricao: true,
                    },
                },
                meio_pagamento: {
                    select: {
                        id: true,
                        descricao: true,
                    },
                },
            },
            orderBy: {
                dt_criacao: 'desc',
            },
        });

        // Mapeia para o formato esperado pelo frontend
        return apostas.map(aposta => ({
            id: aposta.id,
            idCampanha: campanhaId,
            idUsuario: aposta.usuario_id,
            idOpcao: aposta.campanha_opcao_id,
            status: aposta.status,
            comprovante: aposta.comprovante,
            criadoEm: aposta.dt_criacao,
            usuario: aposta.usuario,
            opcao: aposta.campanha_opcao,
            meioPagamento: aposta.meio_pagamento,
        }));
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
        // Busca a aposta com o relacionamento para a campanha
        const aposta = await prisma.aposta.findUnique({
            where: { id },
            include: {
                campanha_opcao: {
                    include: { campanha: true }
                }
            }
        });
        if (!aposta) throw new Error('Aposta não encontrada.');
        if (!aposta.campanha_opcao || !aposta.campanha_opcao.campanha) {
            throw new Error('Campanha não encontrada.');
        }

        const campanha = aposta.campanha_opcao.campanha;
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

    async atualizarAposta(
        id: number,
        data: {
            campanha_opcao_id: number;
            meio_pagamento_id: number;
            comprovante?: string;
        },
        usuarioId: number
    ) {
        // Valida se os IDs são números positivos
        if (isNaN(data.campanha_opcao_id) || data.campanha_opcao_id <= 0) {
            throw new Error('ID da opção de campanha inválido.');
        }
        if (isNaN(data.meio_pagamento_id) || data.meio_pagamento_id <= 0) {
            throw new Error('ID do meio de pagamento inválido.');
        }

        const aposta = await prisma.aposta.findUnique({ where: { id } });
        if (!aposta) throw new Error('Aposta não encontrada.');
        if (aposta.usuario_id !== usuarioId) {
            throw new Error('Você não pode editar esta aposta.');
        }
        if (aposta.status === 'CONFIRMADA' || aposta.status === 'REJEITADA') {
            throw new Error('Aposta já confirmada ou rejeitada, não pode ser editada.');
        }

        // Verifica se a nova opção pertence à mesma campanha (opcional)
        const opcao = await prisma.campanha_opcao.findUnique({
            where: { id: data.campanha_opcao_id },
        });
        if (!opcao) throw new Error('Opção de campanha não encontrada.');

        // Verifica se a opção pertence à campanha da aposta (via campanha original)
        // Apenas para segurança
        const campanhaIdOriginal = await prisma.campanha_opcao.findUnique({
            where: { id: aposta.campanha_opcao_id },
            select: { campanha_id: true },
        });
        if (campanhaIdOriginal?.campanha_id !== opcao.campanha_id) {
            throw new Error('A opção escolhida não pertence à mesma campanha.');
        }

        let novoStatus = aposta.status;
        if (data.comprovante && aposta.status === 'PENDENTE') {
            novoStatus = 'AGUARDANDO_VALIDACAO';
        }

        return await prisma.aposta.update({
            where: { id },
            data: {
                campanha_opcao_id: data.campanha_opcao_id,
                meio_pagamento_id: data.meio_pagamento_id,
                comprovante: data.comprovante ?? aposta.comprovante,
                status: novoStatus,
            },
            include: {
                campanha_opcao: {
                    include: { campanha: true }
                },
                meio_pagamento: true,
            }
        });
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
}