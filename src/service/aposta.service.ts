import { prisma } from '../database/prismaClient';
import { CriarApostaInputDTO } from '../dtos/aposta.dto';

export class ApostaService {
    async criar({ usuario_id, campanha_opcao_id, meio_pagamento_id }: CriarApostaInputDTO) {
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
                status: 'PENDENTE',
            },
            include: {
                campanha_opcao: true,
                meio_pagamento: true,
            }
        });

        return novaAposta;
    }

    async listarPorUsuario(usuario_id: string) {
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
}