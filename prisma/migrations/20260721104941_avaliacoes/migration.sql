-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Depoimento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "nota" INTEGER NOT NULL DEFAULT 5,
    "fonte" TEXT NOT NULL DEFAULT 'Google',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Depoimento" ("ativo", "criadoEm", "id", "nome", "ordem", "texto") SELECT "ativo", "criadoEm", "id", "nome", "ordem", "texto" FROM "Depoimento";
DROP TABLE "Depoimento";
ALTER TABLE "new_Depoimento" RENAME TO "Depoimento";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
