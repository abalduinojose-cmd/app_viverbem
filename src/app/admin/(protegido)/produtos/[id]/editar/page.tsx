// Edição de um produto existente.
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { FormProduto } from "@/components/admin/FormProduto";

export const dynamic = "force-dynamic";

export default async function PaginaEditarProduto({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [produto, categorias] = await Promise.all([
    db.produto.findUnique({ where: { id: Number(id) } }),
    db.categoria.findMany({ orderBy: { ordem: "asc" } }),
  ]);

  if (!produto) notFound();

  return (
    <FormProduto
      categorias={categorias}
      produto={{
        id: produto.id,
        nome: produto.nome,
        slug: produto.slug,
        descricao: produto.descricao,
        precoCentavos: produto.precoCentavos,
        tipo: produto.tipo,
        fotoUrl: produto.fotoUrl,
        ativo: produto.ativo,
        novidade: produto.novidade,
        destaque: produto.destaque,
        ordem: produto.ordem,
        categoriaId: produto.categoriaId,
        dosagens: produto.dosagens,
        composicao: produto.composicao,
        modoUso: produto.modoUso,
        indicacoes: produto.indicacoes,
        apresentacao: produto.apresentacao,
      }}
    />
  );
}
