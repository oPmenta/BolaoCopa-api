import { prisma } from '../database/prismaClient';
import { CriarCampanhaInputDTO } from '../dtos/campanha.dto';
import { Role } from '@prisma/client';

export class CampanhaService {
    async criar(data: CriarCampanhaInputDTO, usuarioId: number) {
        const {
            nome,
            dt_inicio,
            dt_fim,
            taxa_operacional,
            valor_bolao,
            codigo_campanha,
            tipo_campanha_id,
            opcoes
        } = data;

        if (!opcoes || opcoes.length < 2) {
            throw new Error('A campanha deve ter pelo menos 2 opções de aposta.');
        }

        const valorBolaoNum = Number(valor_bolao);
        if (isNaN(valorBolaoNum) || valorBolaoNum <= 0) {
            throw new Error('Valor do bolão deve ser um número maior que zero.');
        }

        const opcoesUnicas = [...new Set(opcoes.map(o => o.trim().toUpperCase()))];
        if (opcoesUnicas.length !== opcoes.length) {
            throw new Error('Opções duplicadas não são permitidas.');
        }

        const criador = await prisma.usuario.findUnique({ where: { id: usuarioId } });
        if (!criador) throw new Error('Criador não encontrado.');

        let tipoFinal: number;
        if (criador.tipo_usuario === Role.USER) {
            const tipoPrivada = await prisma.tipo_campanha.findFirst({
                where: { descricao: { equals: 'PRIVADA', mode: 'insensitive' } }
            });
            if (!tipoPrivada) throw new Error('Tipo PRIVADA não encontrado.');
            tipoFinal = tipoPrivada.id;
        } else if (criador.tipo_usuario === Role.ADMIN) {
            if (!tipo_campanha_id) {
                throw new Error('Tipo de campanha é obrigatório para administradores.');
            }
            const tipo = await prisma.tipo_campanha.findUnique({
                where: { id: tipo_campanha_id },
            });
            if (!tipo) throw new Error('Tipo de campanha inválido.');
            if (tipo.status !== 'ATIVO') throw new Error('Tipo indisponível.');
            tipoFinal = tipo.id;
        } else {
            throw new Error('Tipo de usuário inválido.');
        }

        const dataInicio = new Date(dt_inicio);
        const dataFim = new Date(dt_fim);
        const agora = new Date();
        if (isNaN(dataInicio.getTime()) || isNaN(dataFim.getTime())) {
            throw new Error('Datas inválidas.');
        }
        if (dataInicio <= agora) {
            throw new Error('Data de início deve ser futura.');
        }
        if (dataFim <= dataInicio) {
            throw new Error('Data de fim deve ser posterior ao início.');
        }

        const codigoExiste = await prisma.campanha.findUnique({
            where: { codigo_campanha: codigo_campanha.toUpperCase().trim() },
        });
        if (codigoExiste) throw new Error('Código de campanha já existe.');

        const result = await prisma.$transaction(async (tx) => {
            const novaCampanha = await tx.campanha.create({
                data: {
                    nome,
                    dt_inicio: dataInicio,
                    dt_fim: dataFim,
                    taxa_operacional: Number(taxa_operacional) || 0,
                    valor_bolao: valorBolaoNum,
                    codigo_campanha: codigo_campanha.toUpperCase().trim(),
                    status: 'ABERTA',
                    criador_id: usuarioId,
                    tipo_campanha_id: tipoFinal,
                },
            });

            await tx.campanha_opcao.createMany({
                data: opcoesUnicas.map(descricao => ({
                    campanha_id: novaCampanha.id,
                    descricao: descricao.trim(),
                    status: 'ATIVO',
                    eh_resultado_final: false,
                })),
            });

            const campanhaCriada = await tx.campanha.findUnique({
                where: { id: novaCampanha.id },
                include: { opcoes: true, tipo_campanha: true },
            });

            if (!campanhaCriada) {
                throw new Error('Erro ao recuperar a campanha criada.');
            }

            return {
                ...campanhaCriada,
                tipo: campanhaCriada.tipo_campanha.descricao,
                codigoConvite: campanhaCriada.codigo_campanha,
                valorAposta: campanhaCriada.valor_bolao,
            };
        });

        return result;
    }

    async listarTodas() {
        const campanhas = await prisma.campanha.findMany({
            include: { tipo_campanha: true },
        });
        return campanhas.map(c => ({
            ...c,
            tipo: c.tipo_campanha.descricao,
            codigoConvite: c.codigo_campanha,
            valorAposta: c.valor_bolao,
        }));
    }

    async listarApenasPublicas() {
        const tipoPublica = await prisma.tipo_campanha.findFirst({
            where: { descricao: { equals: 'PÚBLICA', mode: 'insensitive' } }
        });
        if (!tipoPublica) return [];

        const campanhas = await prisma.campanha.findMany({
            where: {
                tipo_campanha_id: tipoPublica.id,
                status: 'ABERTA',
            },
            include: { tipo_campanha: true },
        });
        return campanhas.map(c => ({
            ...c,
            tipo: c.tipo_campanha.descricao,
            codigoConvite: c.codigo_campanha,
            valorAposta: c.valor_bolao,
        }));
    }

    async listarPorCriador(criadorId: number) {
        const campanhas = await prisma.campanha.findMany({
            where: { criador_id: criadorId },
            include: { tipo_campanha: true, opcoes: true },
            orderBy: { dt_inicio: 'desc' },
        });
        return campanhas.map(c => ({
            ...c,
            tipo: c.tipo_campanha.descricao,
            codigoConvite: c.codigo_campanha,
            valorAposta: c.valor_bolao,
        }));
    }

    async buscarPorCodigo(codigo: string) {
        if (!codigo) throw new Error('Código obrigatório.');
        const campanha = await prisma.campanha.findUnique({
            where: { codigo_campanha: codigo.toUpperCase().trim() },
            include: { tipo_campanha: true, opcoes: true },
        });
        if (!campanha) throw new Error('Campanha não encontrada.');
        return {
            ...campanha,
            tipo: campanha.tipo_campanha.descricao,
            codigoConvite: campanha.codigo_campanha,
            valorAposta: campanha.valor_bolao,
            criadorId: campanha.criador_id,
        };
    }

    async atualizarStatus(id: number, novoStatus: string, usuarioId: number) {
        const campanha = await prisma.campanha.findUnique({ where: { id } });
        if (!campanha) throw new Error('Campanha não encontrada.');

        const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } });
        if (!usuario) throw new Error('Usuário não encontrado.');

        if (campanha.criador_id !== usuarioId) {
            throw new Error('Apenas o criador da campanha pode alterar o status.');
        }

        const statusPermitidos = ['ABERTA', 'FECHADA', 'ENCERRADA'];
        const statusFormatado = novoStatus.toUpperCase().trim();
        if (!statusPermitidos.includes(statusFormatado)) {
            throw new Error('Status inválido.');
        }

        return await prisma.campanha.update({
            where: { id },
            data: { status: statusFormatado }
        });
    }
}