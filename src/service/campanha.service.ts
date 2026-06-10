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
            tipo_campanha_id,
            criador_id,
            privacidade,
            opcoes
        } = data;

        if (!nome || !dt_inicio || !dt_fim || !codigo_campanha || !tipo_campanha_id || !criador_id) {
            throw new Error('Todos os campos obrigatórios da campanha devem ser preenchidos, incluindo o criador.');
        }

        if (!opcoes || opcoes.length < 2) {
            throw new Error('A campanha deve ter pelo menos 2 opções de aposta.');
        }

        const criadorExiste = await prisma.usuario.findUnique({
            where: { id: criador_id },
        });

        if (!criadorExiste) {
            throw new Error('O usuário criador informado não existe no sistema.');
        }

        let privacidadeDefinida = privacidade ?? false;
        if (criadorExiste.tipo_usuario === Role.USER) {
            privacidadeDefinida = true;
        }

        const dataInicio = new Date(dt_inicio);
        const dataFim = new Date(dt_fim);

        if (dataFim < dataInicio) {
            throw new Error('A data de fim (dt_fim) não pode ser menor que a data de início (dt_inicio).');
        }

        const tipoExiste = await prisma.tipo_campanha.findUnique({
            where: { id: tipo_campanha_id },
        });

        if (!tipoExiste) {
            throw new Error('O tipo de campanha informado não existe no sistema.');
        }

        if (tipoExiste.status !== 'ATIVO') {
            throw new Error('O tipo de campanha informado está indisponível.');
        }

        const codigoExiste = await prisma.campanha.findUnique({
            where: { codigo_campanha: codigo_campanha.toUpperCase().trim() },
        });

        if (codigoExiste) {
            throw new Error('Este código de campanha já está em uso.');
        }

        // Usando transação para criar campanha + opções
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
                    privacidade: privacidadeDefinida,
                    criador_id,
                    tipo_campanha_id,
                },
            });

            // Criar todas as opções
            await tx.campanha_opcao.createMany({
                data: opcoes.map(descricao => ({
                    campanha_id: novaCampanha.id,
                    descricao: descricao.trim(),
                    status: 'ATIVO',
                    eh_resultado_final: false,
                })),
            });

            // Retornar campanha com as opções incluídas
            return await tx.campanha.findUnique({
                where: { id: novaCampanha.id },
                include: { opcoes: true },
            });
        });

        return result;
    }

    async listarTodas() {
        return await prisma.campanha.findMany({
            include: {
                tipo_campanha: true,
            },
        });
    }

    async listarApenasPublicas() {
        return await prisma.campanha.findMany({
            where: {
                privacidade: false,
                status: 'ABERTA'
            },
            include: {
                tipo_campanha: true,
            }
        });
    }

    async buscarPorCodigo(codigo: string) {
        if (!codigo) {
            throw new Error('O código de convite é obrigatório para realizar a busca.');
        }

        const campanha = await prisma.campanha.findUnique({
            where: { codigo_campanha: codigo.toUpperCase().trim() },
            include: {
                tipo_campanha: true,
                opcoes: true,
            }
        });

        if (!campanha) {
            throw new Error('Nenhum bolão ou campanha foi localizado com este código de convite.');
        }

        return campanha;
    }

    async atualizarStatus(id: number, novoStatus: string, usuarioId: number) {
        const campanha = await prisma.campanha.findUnique({ where: { id } });
        if (!campanha) throw new Error('Campanha não encontrada.');

        const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } });
        if (!usuario) throw new Error('Usuário não encontrado.');

        if (campanha.criador_id !== usuarioId) {
            throw new Error('Apenas o criador da campanha ou um administrador pode alterar o status.');
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