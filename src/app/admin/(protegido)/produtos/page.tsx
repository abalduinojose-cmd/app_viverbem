// Listagem de produtos do painel (carrega tudo no servidor).
// Passa o papel do usuário para o cliente: operador não vê "Apagar"
// nem consegue reordenar (drag-and-drop é só para admin).
// As categorias alimentam o filtro por categoria.
import { db } from "@/lib/db";
import { obterSessao } from "@/lib/sessao";
import { ListaProdutos } from "@/components/admin/ListaProdutos";

export const dynamic = "force-dynamic";

export default async function PaginaProdutos() {
  const [produtos, categorias, sessao] = await Promise.all([
    db.produto.findMany({
      orderBy: [{ ordem: "asc" }, { nome: "asc" }],
      include: { categoria: { select: { nome: true } } },
    }),
    db.categoria.findMany({ orderBy: { ordem: "asc" } }),
    obterSessao(),
  ]);

  return (
    <ListaProdutos
      papel={sessao.papel ?? "OPERADOR"}
      categorias={categorias.map((c) => ({
        id: c.id,
        nome: c.nome,
        slug: c.slug,
        ordem: c.ordem,
      }))}
      produtos={produtos.map((p) => ({
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
      }))}
    />
  );
}
