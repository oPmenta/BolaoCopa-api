import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    await prisma.tipo_campanha.upsert({
        where: { id: 1 },
        update: { descricao: "PUBLICA" },
        create: { id: 1, descricao: "PUBLICA", status: "ATIVO" },
    });

    await prisma.tipo_campanha.upsert({
        where: { id: 2 },
        update: { descricao: "PRIVADA" },
        create: { id: 2, descricao: "PRIVADA", status: "ATIVO" },
    });

    console.log("Tipos de campanha inseridos com sucesso.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });