// Log de alterações do painel: quem alterou o quê e quando.
// SOMENTE ADMIN. Registros gerados automaticamente pelas rotas de API.
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { obterSessao } from "@/lib/sessao";
import { PAPEL_ADMIN } from "@/lib/tipos";

export const dynamic = "force-dynamic";

export default async function PaginaLog() {
  const sessao = await obterSessao();
  if (sessao.papel !== PAPEL_ADMIN) {
    redirect("/admin/produtos");
  }

  // Mostra os 200 registros mais recentes
  const registros = await db.logAlteracao.findMany({
    orderBy: { criadoEm: "desc" },
    take: 200,
  });

  const formatarData = (data: Date) =>
    data.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-grafite">Log de alterações</h1>
      <p className="text-grafite-claro mt-1">
        Registro automático das últimas {registros.length} ações no painel.
      </p>

      <div className="mt-5 bg-white rounded-2xl border border-grafite/10 shadow-sm overflow-hidden">
        {registros.length === 0 && (
          <p className="text-grafite-claro py-10 text-center">Nenhuma alteração registrada ainda.</p>
        )}
        {registros.map((r) => (
          <div
            key={r.id}
            className="px-5 py-3.5 border-b border-grafite/5 last:border-b-0 flex flex-wrap items-baseline gap-x-3 gap-y-1"
          >
            <span className="text-xs text-grafite-claro tabular-nums shrink-0">
              {formatarData(r.criadoEm)}
            </span>
            <span className="font-semibold text-royal">{r.usuario}</span>
            <span className="text-grafite">{r.acao}</span>
            <span className="text-grafite-claro">{r.detalhe}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
