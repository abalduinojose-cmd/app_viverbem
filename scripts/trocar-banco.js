// Alterna o banco do projeto entre SQLite (desenvolvimento local)
// e PostgreSQL (produção na nuvem).
//
// O Prisma não permite escolher o provider por variável de ambiente,
// então este script reescreve a linha do schema.
//
// Uso:
//   npm run db:sqlite     -> volta para o SQLite local
//   npm run db:postgres   -> prepara para PostgreSQL
//
// Depois de trocar para Postgres, aponte DATABASE_URL para o servidor
// e rode:  npx prisma db push  &&  npm run db:seed

const fs = require("fs");
const path = require("path");

const destino = process.argv[2];
if (destino !== "sqlite" && destino !== "postgres") {
  console.error('Informe o banco: "sqlite" ou "postgres".');
  process.exit(1);
}

const provider = destino === "postgres" ? "postgresql" : "sqlite";
const caminho = path.join(__dirname, "..", "prisma", "schema.prisma");
const original = fs.readFileSync(caminho, "utf8");

// Troca apenas a linha do provider dentro do bloco datasource
const atualizado = original.replace(
  /(datasource\s+db\s*\{[^}]*?provider\s*=\s*)"[^"]+"/,
  `$1"${provider}"`
);

if (atualizado === original) {
  console.log(`Nada a fazer — o schema já usa "${provider}".`);
} else {
  fs.writeFileSync(caminho, atualizado);
  console.log(`Schema atualizado para "${provider}".`);
}

if (destino === "postgres") {
  console.log("\nPróximos passos:");
  console.log("  1. Aponte DATABASE_URL para o seu Postgres");
  console.log("  2. npx prisma db push");
  console.log("  3. npm run db:seed");
}
