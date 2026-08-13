// /admin — porta de entrada: o gestor cai na visão geral, o operador
// vai direto para os produtos, que é tudo o que ele pode mexer.
import { redirect } from "next/navigation";
import { obterSessao } from "@/lib/sessao";
import { PAPEL_ADMIN } from "@/lib/tipos";

export default async function PaginaAdmin() {
  const sessao = await obterSessao();
  redirect(sessao.papel === PAPEL_ADMIN ? "/admin/painel" : "/admin/produtos");
}
