// Listagem de produtos do painel (carrega tudo no servidor).
// Passa o papel do usuário para o cliente: operador não vê "Apagar"
// nem consegue reordenar (drag-and-drop é só para admin).
import { db } from "@/lib/db";
import { obterSessao } from "@/lib/sessao";
import { ListaProdutos } from "@/components/admin/ListaProdutos";

export const dynamic = "force-dynamic";

export default async function PaginaProdutos() {
  const [produtos, sessao] = await Promise.all([
    db.produto.findMany({
      orderBy: [{ ordem: "asc" }, { nome: "asc" }],
      include: { categoria: { select: { nome: true } } },
    }),
    obterSessao(),
  ]);

  return (
    <ListaProdutos
      papel={sessao.papel ?? "OPERADOR"}
      produtos={produtos.map((p) => ({
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
      }))}
    />
  );
}
