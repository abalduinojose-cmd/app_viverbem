// Cadastro de novo produto.
import { db } from "@/lib/db";
import { FormProduto } from "@/components/admin/FormProduto";

export const dynamic = "force-dynamic";

export default async function PaginaNovoProduto() {
  const categorias = await db.categoria.findMany({ orderBy: { ordem: "asc" } });
  return <FormProduto categorias={categorias} />;
}
