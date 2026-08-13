// Cabeçalho padrão das seções da home: selo, título, descrição e o
// atalho opcional "ver tudo" alinhado à direita.
import Link from "next/link";

export function SecaoTitulo({
  selo,
  titulo,
  descricao,
  verTudo,
  corSelo = "royal",
}: {
  selo: string;
  titulo: string;
  descricao?: string;
  verTudo?: string;
  corSelo?: "royal" | "escarlate";
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-7">
      <div>
        <span
          className={`inline-block text-xs font-semibold tracking-[0.22em] uppercase px-4 py-1.5 rounded-full ${
            corSelo === "escarlate"
              ? "text-escarlate bg-escarlate/10"
              : "text-royal bg-royal-claro"
          }`}
        >
          {selo}
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-grafite tracking-tight mt-3">
          {titulo}
        </h2>
        {descricao && <p className="text-grafite-medio text-lg mt-1.5">{descricao}</p>}
      </div>
      {verTudo && (
        <Link
          href={verTudo}
          className="shrink-0 inline-flex items-center gap-2 text-royal font-semibold hover:gap-3 transition-all"
        >
          Ver tudo
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      )}
    </div>
  );
}
