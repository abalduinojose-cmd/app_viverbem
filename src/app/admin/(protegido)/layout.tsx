// Layout das páginas protegidas do painel: exige sessão válida
// (senão redireciona para o login) e desenha a barra lateral.
// O menu é agrupado por área; OPERADOR só enxerga o grupo Catálogo.
import { redirect } from "next/navigation";
import Link from "next/link";
import { obterSessao } from "@/lib/sessao";
import { PAPEL_ADMIN } from "@/lib/tipos";
import { BotaoSair } from "@/components/admin/BotaoSair";

// Ícones em SVG (sem emoji) para o menu
const icones = {
  produtos: (
    <>
      <path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5v-9Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="m3.5 7.5 8.5 4.6 8.5-4.6M12 21v-8.9" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </>
  ),
  categorias: (
    <>
      <rect x="3.5" y="4" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <rect x="13.5" y="4" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <rect x="3.5" y="13" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <rect x="13.5" y="13" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.7" />
    </>
  ),
  log: (
    <>
      <rect x="4.5" y="3" width="15" height="18" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8.5 8h7M8.5 12h7M8.5 16h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </>
  ),
  totem: (
    <>
      <rect x="3" y="4" width="18" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M9 21h6M12 17v4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </>
  ),
};

function ItemMenu({
  href,
  icone,
  children,
  externo = false,
}: {
  href: string;
  icone: React.ReactNode;
  children: React.ReactNode;
  externo?: boolean;
}) {
  const classe =
    "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[0.95rem] font-medium text-white/85 hover:text-white hover:bg-white/10 transition-colors";
  const conteudo = (
    <>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
        {icone}
      </svg>
      {children}
    </>
  );

  if (externo) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classe}>
        {conteudo}
      </a>
    );
  }
  return (
    <Link href={href} className={classe}>
      {conteudo}
    </Link>
  );
}

function TituloGrupo({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-3.5 pt-5 pb-1.5 text-[0.6rem] font-semibold tracking-[0.2em] uppercase text-white/40">
      {children}
    </p>
  );
}

export default async function LayoutAdmin({ children }: { children: React.ReactNode }) {
  const sessao = await obterSessao();
  if (!sessao.usuarioId) {
    redirect("/admin/login");
  }
  const ehAdmin = sessao.papel === PAPEL_ADMIN;

  return (
    <div className="flex-1 flex min-h-screen bg-royal-nevoa">
      {/* ---------- Barra lateral ---------- */}
      <aside className="w-64 shrink-0 bg-royal text-white flex flex-col">
        {/* Logo oficial num cartão branco (o logo é escuro, não lê no azul) */}
        <div className="px-5 py-6 border-b border-white/15">
          <div className="bg-white rounded-2xl px-4 py-3 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Manipulação Viver Bem"
              className="w-full max-w-[10rem] object-contain"
              draggable={false}
            />
          </div>
          <p className="text-[0.6rem] tracking-[0.25em] uppercase mt-3 text-white/70 text-center">
            Painel Administrativo
          </p>
        </div>

        <nav className="flex flex-col flex-1 p-3 overflow-y-auto">
          <TituloGrupo>Catálogo</TituloGrupo>
          <ItemMenu href="/admin/produtos" icone={icones.produtos}>
            Produtos e preços
          </ItemMenu>
          {ehAdmin && (
            <ItemMenu href="/admin/categorias" icone={icones.categorias}>
              Categorias
            </ItemMenu>
          )}

          {ehAdmin && (
            <>
              <TituloGrupo>Acompanhamento</TituloGrupo>
              <ItemMenu href="/admin/log" icone={icones.log}>
                Log de alterações
              </ItemMenu>
            </>
          )}

          <TituloGrupo>Totem</TituloGrupo>
          <ItemMenu href="/" icone={icones.totem} externo>
            Ver totem do cliente
          </ItemMenu>
        </nav>

        <div className="p-3 border-t border-white/15">
          <p className="px-3.5 pb-0.5 text-sm text-white/80 truncate">{sessao.nome}</p>
          <p className="px-3.5 pb-2.5 text-[0.65rem] uppercase tracking-wider text-white/45">
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
