// Layout das páginas protegidas do painel: exige sessão válida
// (senão redireciona para o login) e desenha a barra lateral.
// O menu muda conforme o papel: OPERADOR só vê Produtos;
// ADMIN vê tudo (Categorias, Depoimentos e Log de alterações).
import { redirect } from "next/navigation";
import Link from "next/link";
import { obterSessao } from "@/lib/sessao";
import { PAPEL_ADMIN } from "@/lib/tipos";
import { BotaoSair } from "@/components/admin/BotaoSair";

export default async function LayoutAdmin({ children }: { children: React.ReactNode }) {
  const sessao = await obterSessao();
  if (!sessao.usuarioId) {
    redirect("/admin/login");
  }
  const ehAdmin = sessao.papel === PAPEL_ADMIN;

  return (
    <div className="flex-1 flex min-h-screen bg-royal-claro/30">
      {/* ---------- Barra lateral ---------- */}
      <aside className="w-60 shrink-0 bg-royal text-white flex flex-col">
        <div className="px-5 py-6 border-b border-white/15">
          <p className="fonte-logo text-3xl leading-none">Viver Bem</p>
          <p className="text-[0.6rem] tracking-[0.25em] uppercase mt-1 text-white/80">
            Painel Admin
          </p>
        </div>

        <nav className="flex flex-col gap-1 p-3 flex-1">
          <Link
            href="/admin/produtos"
            className="rounded-xl px-4 py-3 font-medium hover:bg-white/10 transition-colors"
          >
            📦 Produtos
          </Link>
          {ehAdmin && (
            <>
              <Link
                href="/admin/categorias"
                className="rounded-xl px-4 py-3 font-medium hover:bg-white/10 transition-colors"
              >
                🗂️ Categorias
              </Link>
              <Link
                href="/admin/depoimentos"
                className="rounded-xl px-4 py-3 font-medium hover:bg-white/10 transition-colors"
              >
                ⭐ Avaliações
              </Link>
              <Link
                href="/admin/log"
                className="rounded-xl px-4 py-3 font-medium hover:bg-white/10 transition-colors"
              >
                📜 Log de alterações
              </Link>
            </>
          )}
          <a
            href="/"
            target="_blank"
            className="rounded-xl px-4 py-3 font-medium hover:bg-white/10 transition-colors"
          >
            🖥️ Ver totem
          </a>
        </nav>

        <div className="p-3 border-t border-white/15">
          <p className="px-4 pb-1 text-sm text-white/70 truncate">Olá, {sessao.nome}</p>
          <p className="px-4 pb-2 text-[0.65rem] uppercase tracking-wider text-white/50">
            {ehAdmin ? "Administrador" : "Operador"}
          </p>
          <BotaoSair />
        </div>
      </aside>

      {/* ---------- Conteúdo ---------- */}
      <main className="flex-1 p-6 md:p-10 overflow-x-auto">{children}</main>
    </div>
  );
}
