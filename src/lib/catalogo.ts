// Consulta do catálogo público (usada pela página do totem E pela
// rota /api/totem/catalogo — mesma fonte de dados nos dois lugares,
// o que já prepara o caminho para o modo offline da Fase 3).
import { db } from "@/lib/db";
import { CategoriaDTO, ProdutoDTO } from "@/lib/tipos";

export interface Catalogo {
  categorias: CategoriaDTO[];
  produtos: ProdutoDTO[]; // apenas ativos, com nome da categoria embutido
}

export async function obterCatalogo(): Promise<Catalogo> {
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
