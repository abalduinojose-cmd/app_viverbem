// Gestão de categorias do painel (SOMENTE ADMIN — operador é
// redirecionado para a listagem de produtos).
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { obterSessao } from "@/lib/sessao";
import { PAPEL_ADMIN } from "@/lib/tipos";
import { ListaCategorias } from "@/components/admin/ListaCategorias";

export const dynamic = "force-dynamic";

export default async function PaginaCategorias() {
  const sessao = await obterSessao();
  if (sessao.papel !== PAPEL_ADMIN) {
    redirect("/admin/produtos");
  }

  const categorias = await db.categoria.findMany({
    orderBy: { ordem: "asc" },
    include: { _count: { select: { produtos: true } } },
  });

  return (
    <ListaCategorias
      categorias={categorias.map((c) => ({
        id: c.id,
        nome: c.nome,
        slug: c.slug,
        ordem: c.ordem,
        totalProdutos: c._count.produtos,
      }))}
    />
  );
}
