-- CreateEnum
CREATE TYPE "ApostaStatus" AS ENUM ('PENDENTE', 'AGUARDANDO_VALIDACAO', 'CONFIRMADA', 'REJEITADA');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "usuario" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "tipo_usuario" "Role" NOT NULL DEFAULT 'USER',
    "senha" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ATIVO',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipo_campanha" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ATIVO',

    CONSTRAINT "tipo_campanha_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campanha" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "dt_inicio" TIMESTAMP(3) NOT NULL,
    "dt_fim" TIMESTAMP(3) NOT NULL,
    "taxa_operacional" DOUBLE PRECISION NOT NULL,
    "valor_bolao" DOUBLE PRECISION NOT NULL,
    "codigo_campanha" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ABERTA',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "criador_id" INTEGER NOT NULL,
    "tipo_campanha_id" INTEGER NOT NULL,

    CONSTRAINT "campanha_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campanha_opcao" (
    "id" SERIAL NOT NULL,
    "campanha_id" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ATIVO',
    "eh_resultado_final" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "campanha_opcao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meio_pagamento" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ATIVO',

    CONSTRAINT "meio_pagamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aposta" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "campanha_opcao_id" INTEGER NOT NULL,
    "meio_pagamento_id" INTEGER NOT NULL,
    "dt_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ApostaStatus" NOT NULL DEFAULT 'PENDENTE',
    "comprovante" TEXT,

    CONSTRAINT "aposta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_cpf_key" ON "usuario"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "campanha_codigo_campanha_key" ON "campanha"("codigo_campanha");

-- CreateIndex
CREATE UNIQUE INDEX "campanha_opcao_campanha_id_descricao_key" ON "campanha_opcao"("campanha_id", "descricao");

-- AddForeignKey
ALTER TABLE "campanha" ADD CONSTRAINT "campanha_criador_id_fkey" FOREIGN KEY ("criador_id") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campanha" ADD CONSTRAINT "campanha_tipo_campanha_id_fkey" FOREIGN KEY ("tipo_campanha_id") REFERENCES "tipo_campanha"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campanha_opcao" ADD CONSTRAINT "campanha_opcao_campanha_id_fkey" FOREIGN KEY ("campanha_id") REFERENCES "campanha"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aposta" ADD CONSTRAINT "aposta_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aposta" ADD CONSTRAINT "aposta_campanha_opcao_id_fkey" FOREIGN KEY ("campanha_opcao_id") REFERENCES "campanha_opcao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aposta" ADD CONSTRAINT "aposta_meio_pagamento_id_fkey" FOREIGN KEY ("meio_pagamento_id") REFERENCES "meio_pagamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
