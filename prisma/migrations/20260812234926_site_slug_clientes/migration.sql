/*
  Warnings:

  - Added the required column `slug` to the `Produto` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Cliente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "itens" TEXT NOT NULL,
    "totalCentavos" INTEGER NOT NULL,
    "pagamento" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Produto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "precoCentavos" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'PRODUTO',
    "fotoUrl" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "novidade" BOOLEAN NOT NULL DEFAULT false,
    "destaque" BOOLEAN NOT NULL DEFAULT false,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "dosagens" TEXT,
    "categoriaId" INTEGER,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" DATETIME NOT NULL,
    CONSTRAINT "Produto_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Produto" ("ativo", "atualizadoEm", "categoriaId", "criadoEm", "descricao", "destaque", "dosagens", "fotoUrl", "id", "nome", "novidade", "ordem", "precoCentavos", "tipo") SELECT "ativo", "atualizadoEm", "categoriaId", "criadoEm", "descricao", "destaque", "dosagens", "fotoUrl", "id", "nome", "novidade", "ordem", "precoCentavos", "tipo" FROM "Produto";
DROP TABLE "Produto";
ALTER TABLE "new_Produto" RENAME TO "Produto";
CREATE UNIQUE INDEX "Produto_slug_key" ON "Produto"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
