// Foto do produto com fallback: se não houver foto cadastrada,
// mostra um placeholder clean com as cores da marca.
// (Usamos <img> comum em vez de next/image porque as fotos são
// enviadas pelo painel em tempo de execução e também há SVGs.)
import { asset } from "@/lib/asset";

export function FotoProduto({
  fotoUrl,
  nome,
  className = "",
}: {
  fotoUrl: string | null;
  nome: string;
  className?: string;
}) {
  if (!fotoUrl) {
    return (
      <div
        className={`bg-royal-nevoa flex items-center justify-center ${className}`}
        aria-label={nome}
      >
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="7" y="2.5" width="10" height="19" rx="5" stroke="#1C69B5" strokeWidth="1.5" opacity="0.55" />
          <path d="M7 12h10" stroke="#E02129" strokeWidth="1.5" opacity="0.55" />
        </svg>
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={asset(fotoUrl)} alt={nome} className={`object-cover ${className}`} draggable={false} />
  );
}
