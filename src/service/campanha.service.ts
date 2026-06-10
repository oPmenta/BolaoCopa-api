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
            privacidade
        } = data;

        if (!nome || !dt_inicio || !dt_fim || !codigo_campanha || !tipo_campanha_id || !criador_id) {
            throw new Error('Todos os campos obrigatórios da campanha devem ser preenchidos, incluindo o criador.');
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

        const novaCampanha = await prisma.campanha.create({
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

        return novaCampanha;
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

    async atualizarStatus(id: string, novoStatus: string) {
        const statusPermitidos = ['ABERTA', 'FECHADA', 'ENCERRADA'];
        const statusFormatado = novoStatus.toUpperCase().trim();

        if (!statusPermitidos.includes(statusFormatado)) {
            throw new Error('Status inválido. Escolha entre ABERTA, FECHADA ou ENCERRADA.');
        }

        const campanhaExiste = await prisma.campanha.findUnique({
            where: { id },
        });

        if (!campanhaExiste) {
            throw new Error('Campanha não encontrada.');
        }

        const campanhaAtualizada = await prisma.campanha.update({
            where: { id },
            data: { status: statusFormatado },
        });

        return campanhaAtualizada;
    }
}