// Layout das páginas protegidas do painel: exige sessão válida
// (senão redireciona para o login) e monta a casca com o menu.
// O menu é agrupado por área; OPERADOR só enxerga o grupo Catálogo.
import { redirect } from "next/navigation";
import { obterSessao } from "@/lib/sessao";
import { PAPEL_ADMIN } from "@/lib/tipos";
import { CascaAdmin, type ItemNav } from "@/components/admin/CascaAdmin";

export default async function LayoutAdmin({ children }: { children: React.ReactNode }) {
  const sessao = await obterSessao();
  if (!sessao.usuarioId) {
    redirect("/admin/login");
  }
  const ehAdmin = sessao.papel === PAPEL_ADMIN;

  const itens: ItemNav[] = [
    { href: "/admin/produtos", rotulo: "Produtos e preços", icone: "produtos", grupo: "Catálogo" },
  ];
  if (ehAdmin) {
    itens.push(
      { href: "/admin/categorias", rotulo: "Categorias", icone: "categorias", grupo: "Catálogo" },
      { href: "/admin/clientes", rotulo: "Clientes captados", icone: "clientes", grupo: "Gestão" },
      { href: "/admin/log", rotulo: "Log de alterações", icone: "log", grupo: "Gestão" }
    );
  }
  itens.push({ href: "/", rotulo: "Ver o site", icone: "site", grupo: "Site", externo: true });

  return (
    <CascaAdmin
      itens={itens}
      nome={sessao.nome ?? "Usuário"}
      papel={ehAdmin ? "Administrador" : "Operador"}
    >
      {children}
    </CascaAdmin>
  );
}
