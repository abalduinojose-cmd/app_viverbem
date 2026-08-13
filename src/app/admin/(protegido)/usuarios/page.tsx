// Controle de acessos ao painel — EXCLUSIVO DO GESTOR.
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { obterSessao } from "@/lib/sessao";
import { PAPEL_ADMIN } from "@/lib/tipos";
import { ListaUsuarios } from "@/components/admin/ListaUsuarios";

export const dynamic = "force-dynamic";

export default async function PaginaUsuarios() {
  const sessao = await obterSessao();
  if (sessao.papel !== PAPEL_ADMIN) redirect("/admin/produtos");

  const usuarios = await db.usuario.findMany({
    orderBy: [{ ativo: "desc" }, { papel: "asc" }, { nome: "asc" }],
  });

  return (
    <ListaUsuarios
      meuId={sessao.usuarioId ?? 0}
      usuarios={usuarios.map((u) => ({
        id: u.id,
        nome: u.nome,
        email: u.email,
        papel: u.papel,
        ativo: u.ativo,
        ultimoAcesso: u.ultimoAcesso ? u.ultimoAcesso.toISOString() : null,
        criadoEm: u.criadoEm.toISOString(),
      }))}
    />
  );
}
