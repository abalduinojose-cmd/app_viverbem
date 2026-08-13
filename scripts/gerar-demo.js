// Gera a VITRINE ESTÁTICA do totem para o GitHub Pages.
//
// O GitHub Pages só serve arquivos estáticos, então esta versão:
//   - inclui só o totem do cliente (catálogo, produto, carrinho, WhatsApp)
//   - deixa de fora o painel admin e as rotas de API (precisam de servidor)
//   - congela os produtos num JSON gerado a partir do banco atual
//
// Uso:  npm run demo:build      -> gera a pasta out/
//       npm run demo:publicar   -> gera e publica na branch gh-pages
//
// O projeto volta ao estado original no final, mesmo se der erro.

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const raiz = path.join(__dirname, "..");
const guardados = path.join(raiz, ".demo-temp");

// Arquivos/pastas que saem do build estático (dependem de servidor)
const EXCLUIR = [
  path.join("src", "app", "admin"),
  path.join("src", "app", "api"),
  // redirecionamento não funciona em site estático
  path.join("src", "app", "como-funciona"),
];

// Páginas cuja renderização dinâmica precisa ser desligada no estático
const PAGINAS_DINAMICAS = [
  path.join("src", "app", "(site)", "page.tsx"),
  path.join("src", "app", "(site)", "catalogo", "page.tsx"),
  path.join("src", "app", "(site)", "sobre", "page.tsx"),
  path.join("src", "app", "(site)", "produto", "[slug]", "page.tsx"),
];

const LINHA_DINAMICA = 'export const dynamic = "force-dynamic";';

function log(msg) {
  console.log(`[demo] ${msg}`);
}

/** Lê o banco atual e grava o retrato usado pela vitrine. */
async function gerarRetrato() {
  const { PrismaClient } = require("@prisma/client");
  const db = new PrismaClient();
  try {
    const [categorias, produtos, avaliacoes] = await Promise.all([
      db.categoria.findMany({ orderBy: { ordem: "asc" } }),
      db.produto.findMany({
        where: { ativo: true },
        orderBy: [{ ordem: "asc" }, { nome: "asc" }],
        include: { categoria: { select: { nome: true } } },
      }),
      db.depoimento.findMany({ where: { ativo: true }, orderBy: { ordem: "asc" } }),
    ]);

    const retrato = {
      catalogo: {
        categorias: categorias.map((c) => ({
          id: c.id,
          nome: c.nome,
          slug: c.slug,
          ordem: c.ordem,
        })),
        produtos: produtos.map((p) => ({
          id: p.id,
          nome: p.nome,
          slug: p.slug,
          descricao: p.descricao,
          precoCentavos: p.precoCentavos,
          tipo: p.tipo,
          fotoUrl: p.fotoUrl,
          ativo: p.ativo,
          novidade: p.novidade,
          destaque: p.destaque,
          ordem: p.ordem,
          categoriaId: p.categoriaId,
          categoriaNome: p.categoria?.nome ?? null,
          dosagens: p.dosagens,
        })),
      },
      avaliacoes: avaliacoes.map((a) => ({
        id: a.id,
        nome: a.nome,
        texto: a.texto,
        nota: a.nota,
        fonte: a.fonte,
        fotoUrl: a.fotoUrl,
        ativo: a.ativo,
        ordem: a.ordem,
      })),
    };

    fs.writeFileSync(
      path.join(raiz, "src", "lib", "dados-demo.json"),
      JSON.stringify(retrato, null, 2)
    );
    log(
      `retrato gerado: ${retrato.catalogo.produtos.length} produtos, ` +
        `${retrato.catalogo.categorias.length} categorias, ` +
        `${retrato.avaliacoes.length} avaliações`
    );
  } finally {
    await db.$disconnect();
  }
}

/** Tira do caminho as pastas que não vão para o estático. */
function guardarExcluidos() {
  fs.mkdirSync(guardados, { recursive: true });
  for (const alvo of EXCLUIR) {
    const origem = path.join(raiz, alvo);
    if (!fs.existsSync(origem)) continue;
    const destino = path.join(guardados, alvo.replace(/[\\/]/g, "__"));
    fs.renameSync(origem, destino);
    log(`fora do build: ${alvo}`);
  }
}

function devolverExcluidos() {
  if (!fs.existsSync(guardados)) return;
  for (const alvo of EXCLUIR) {
    const destino = path.join(guardados, alvo.replace(/[\\/]/g, "__"));
    if (!fs.existsSync(destino)) continue;
    const origem = path.join(raiz, alvo);
    fs.mkdirSync(path.dirname(origem), { recursive: true });
    fs.renameSync(destino, origem);
  }
  fs.rmSync(guardados, { recursive: true, force: true });
  log("pastas do servidor devolvidas");
}

/** Comenta a linha de renderização dinâmica (incompatível com export). */
function patchPaginas(ativar) {
  for (const rel of PAGINAS_DINAMICAS) {
    const arquivo = path.join(raiz, rel);
    if (!fs.existsSync(arquivo)) continue;
    let texto = fs.readFileSync(arquivo, "utf8");
    if (ativar) {
      texto = texto.replace(LINHA_DINAMICA, `// ${LINHA_DINAMICA}`);
    } else {
      texto = texto.replace(`// ${LINHA_DINAMICA}`, LINHA_DINAMICA);
    }
    fs.writeFileSync(arquivo, texto);
  }
}

async function main() {
  await gerarRetrato();

  try {
    guardarExcluidos();
    patchPaginas(true);

    // Os tipos de rota gerados pelo dev server ainda citam /admin e /api;
    // sem limpar, o type-check quebra ao construir sem essas pastas.
    for (const cache of ["dev/types", "types"]) {
      const alvo = path.join(raiz, ".next", cache);
      if (fs.existsSync(alvo)) {
        fs.rmSync(alvo, { recursive: true, force: true });
        log(`cache de tipos limpo: .next/${cache}`);
      }
    }

    log("compilando a vitrine estática...");
    execSync("npx next build", {
      cwd: raiz,
      stdio: "inherit",
      env: { ...process.env, DEMO: "1" },
    });

    // O Pages ignora pastas que começam com "_" sem este arquivo
    fs.writeFileSync(path.join(raiz, "out", ".nojekyll"), "");
    log("pronto! vitrine gerada em out/");
  } finally {
    patchPaginas(false);
    devolverExcluidos();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
