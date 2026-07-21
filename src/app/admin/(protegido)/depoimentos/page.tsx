// Gestão de depoimentos exibidos na página "Como funciona" do totem.
// SOMENTE ADMIN.
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { obterSessao } from "@/lib/sessao";
import { PAPEL_ADMIN } from "@/lib/tipos";
import { ListaDepoimentos } from "@/components/admin/ListaDepoimentos";

export const dynamic = "force-dynamic";

export default async function PaginaDepoimentos() {
  const sessao = await obterSessao();
  if (sessao.papel !== PAPEL_ADMIN) {
    redirect("/admin/produtos");
  }

  const depoimentos = await db.depoimento.findMany({ orderBy: { ordem: "asc" } });

  return (
    <ListaDepoimentos
      depoimentos={depoimentos.map((d) => ({
        id: d.id,
        nome: d.nome,
        texto: d.texto,
        nota: d.nota,
        fonte: d.fonte,
        fotoUrl: d.fotoUrl,
        ativo: d.ativo,
        ordem: d.ordem,
      }))}
    />
  );
}
