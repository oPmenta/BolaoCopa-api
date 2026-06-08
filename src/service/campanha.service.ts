import { prisma } from '../database/prismaClient';
import { CriarCampanhaInputDTO } from '../dtos/campanha.dto';

export class CampanhaService {
    async criar(data: CriarCampanhaInputDTO) {
        const {
            nome,
            dt_inicio,
            dt_fim,
            taxa_operacional,
            valor_bolao,
            codigo_campanha,
            tipo_campanha_id
        } = data;

        if (!nome || !dt_inicio || !dt_fim || !codigo_campanha || !tipo_campanha_id) {
            throw new Error('Todos os campos obrigatórios da campanha devem ser preenchidos.');
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