// Consulta do catálogo público (usada pela página do totem E pela
// rota /api/totem/catalogo — mesma fonte de dados nos dois lugares,
// o que já prepara o caminho para o modo offline da Fase 3).
//
// Em modo DEMO (vitrine estática do GitHub Pages) os dados vêm de um
// "retrato" em JSON, gerado por scripts/gerar-demo.js — assim a vitrine
// funciona sem servidor e sem banco.
import { db } from "@/lib/db";
import { CategoriaDTO, ProdutoDTO, DepoimentoDTO } from "@/lib/tipos";

export interface Catalogo {
  categorias: CategoriaDTO[];
  produtos: ProdutoDTO[]; // apenas ativos, com nome da categoria embutido
}

const EH_DEMO = process.env.DEMO === "1";

/** Carrega o retrato estático usado na vitrine de demonstração. */
async function lerRetratoDemo(): Promise<{
  catalogo: Catalogo;
  avaliacoes: DepoimentoDTO[];
}> {
  const dados = await import("./dados-demo.json");
  return (dados.default ?? dados) as unknown as {
    catalogo: Catalogo;
    avaliacoes: DepoimentoDTO[];
  };
}

export async function obterCatalogo(): Promise<Catalogo> {
  if (EH_DEMO) {
    return (await lerRetratoDemo()).catalogo;
  }

  const [categorias, produtos] = await Promise.all([
    db.categoria.findMany({ orderBy: { ordem: "asc" } }),
    db.produto.findMany({
      where: { ativo: true },
      orderBy: [{ ordem: "asc" }, { nome: "asc" }],
      include: { categoria: { select: { nome: true } } },
    }),
  ]);

  return {
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
  };
}

/** Avaliações ativas exibidas na página "Como fazer seu pedido". */
export async function obterAvaliacoes(): Promise<DepoimentoDTO[]> {
  if (EH_DEMO) {
    return (await lerRetratoDemo()).avaliacoes;
  }

  const avaliacoes = await db.depoimento.findMany({
    where: { ativo: true },
    orderBy: { ordem: "asc" },
  });

  return avaliacoes.map((a) => ({
    id: a.id,
    nome: a.nome,
    texto: a.texto,
    nota: a.nota,
    fonte: a.fonte,
    fotoUrl: a.fotoUrl,
    ativo: a.ativo,
    ordem: a.ordem,
  }));
}
