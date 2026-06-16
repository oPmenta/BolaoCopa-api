import { prisma } from '../database/prismaClient';
import { CriarCampanhaInputDTO } from '../dtos/campanha.dto';
import { Role } from '@prisma/client';

export class CampanhaService {
    async criar(data: CriarCampanhaInputDTO) {
        const {
            nome,
            dt_inicio,
            dt_fim,
            taxa_operacional,
            valor_bolao,
            codigo_campanha,
            tipo_campanha_id, // agora usado para privacidade
            criador_id,
            opcoes
        } = data;

        // Validações básicas...
        if (!opcoes || opcoes.length < 2) {
            throw new Error('A campanha deve ter pelo menos 2 opções de aposta.');
        }

        // Verificar criador
        const criadorExiste = await prisma.usuario.findUnique({
            where: { id: criador_id },
        });
        if (!criadorExiste) throw new Error('Criador não encontrado.');

        // Se o criador for USER, força o tipo PRIVADA (pode buscar o id do tipo "PRIVADA")
        // Para simplificar, vamos supor que o tipo "PRIVADA" tem id 2 (ou buscar dinamicamente)
        let tipoFinal = tipo_campanha_id;
        if (criadorExiste.tipo_usuario === Role.USER) {
            // Buscar o tipo "PRIVADA"
            const tipoPrivada = await prisma.tipo_campanha.findFirst({
                where: { descricao: { equals: 'PRIVADA', mode: 'insensitive' } }
            });
            if (!tipoPrivada) throw new Error('Tipo de campanha PRIVADA não encontrado.');
            tipoFinal = tipoPrivada.id;
        }

        // Validar datas
        const dataInicio = new Date(dt_inicio);
        const dataFim = new Date(dt_fim);
        if (dataFim < dataInicio) throw new Error('Data de fim não pode ser menor que início.');

        // Verificar se o tipo de campanha existe e está ativo
        const tipoExiste = await prisma.tipo_campanha.findUnique({
            where: { id: tipoFinal },
        });
        if (!tipoExiste) throw new Error('Tipo de campanha inválido.');
        if (tipoExiste.status !== 'ATIVO') throw new Error('Tipo de campanha indisponível.');

        // Verificar código único
        const codigoExiste = await prisma.campanha.findUnique({
            where: { codigo_campanha: codigo_campanha.toUpperCase().trim() },
        });
        if (codigoExiste) throw new Error('Código de campanha já existe.');

        // Criar transação
        const result = await prisma.$transaction(async (tx) => {
            const novaCampanha = await tx.campanha.create({
                data: {
                    nome,
                    dt_inicio: dataInicio,
                    dt_fim: dataFim,
                    taxa_operacional: Number(taxa_operacional),
                    valor_bolao: Number(valor_bolao),
                    codigo_campanha: codigo_campanha.toUpperCase().trim(),
                    status: 'ABERTA',
                    criador_id,
                    tipo_campanha_id: tipoFinal,
                },
            });

            await tx.campanha_opcao.createMany({
                data: opcoes.map(descricao => ({
                    campanha_id: novaCampanha.id,
                    descricao: descricao.trim(),
                    status: 'ATIVO',
                    eh_resultado_final: false,
                })),
            });

            return await tx.campanha.findUnique({
                where: { id: novaCampanha.id },
                include: { opcoes: true, tipo_campanha: true },
            });
        });

        return result;
    }

    async listarTodas() {
        return await prisma.campanha.findMany({
            include: { tipo_campanha: true },
        });
    }

    async listarApenasPublicas() {
        // Buscar o tipo "PÚBLICA"
        const tipoPublica = await prisma.tipo_campanha.findFirst({
            where: { descricao: { equals: 'PÚBLICA', mode: 'insensitive' } }
        });
        if (!tipoPublica) return []; // ou throw

        return await prisma.campanha.findMany({
            where: {
                tipo_campanha_id: tipoPublica.id,
                status: 'ABERTA',
            },
            include: { tipo_campanha: true },
        });
    }

    async buscarPorCodigo(codigo: string) {
        if (!codigo) throw new Error('Código obrigatório.');
        const campanha = await prisma.campanha.findUnique({
            where: { codigo_campanha: codigo.toUpperCase().trim() },
            include: { tipo_campanha: true, opcoes: true },
        });
        if (!campanha) throw new Error('Campanha não encontrada.');
        return campanha;
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