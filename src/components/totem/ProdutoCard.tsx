// Card de produto — leva à página exclusiva do produto (o mesmo
// endereço que é divulgado no Instagram). Foto em proporção fixa,
// selos discretos, nome, descrição e preço.
import Link from "next/link";
import { ProdutoDTO, TIPO_COMBO, listarDosagens } from "@/lib/tipos";
import { formatarPreco } from "@/lib/preco";
import { FotoProduto } from "./FotoProduto";

export function ProdutoCard({ produto }: { produto: ProdutoDTO }) {
  const dosagens = listarDosagens(produto.dosagens);

  return (
    <Link
      href={`/produto/${produto.slug}`}
      className="group animar-surgir text-left bg-white rounded-3xl border border-linha hover:border-royal/25 hover:sombra-card-hover hover:-translate-y-1 overflow-hidden active:scale-[0.98] transition-all duration-300 flex flex-col w-full h-full"
    >
      <div className="relative p-3 pb-0">
        <div className="relative rounded-2xl overflow-hidden bg-royal-nevoa aspect-square">
          <FotoProduto
            fotoUrl={produto.fotoUrl}
            nome={produto.nome}
            className="w-full h-full group-hover:scale-[1.06] transition-transform duration-500"
          />

          {/* Selos no canto da foto */}
          <div className="absolute top-2.5 left-2.5 flex gap-1.5">
            {produto.novidade && (
              <span className="bg-escarlate text-white text-[0.6rem] font-semibold tracking-wide px-2.5 py-1 rounded-full shadow-sm">
                NOVIDADE
              </span>
            )}
            {produto.tipo === TIPO_COMBO && (
              <span className="bg-royal text-white text-[0.6rem] font-semibold tracking-wide px-2.5 py-1 rounded-full shadow-sm">
                COMBO
              </span>
            )}
          </div>

          {/* Convite que aparece ao passar o mouse (no toque não atrapalha) */}
          <span
            aria-hidden="true"
            className="hidden md:flex absolute inset-x-2.5 bottom-2.5 items-center justify-center gap-1.5 bg-white/95 backdrop-blur-sm text-royal text-xs font-semibold rounded-xl py-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
          >
            Ver produto
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-1 flex-1">
        {/* Categoria acima do nome, para situar dentro da grade */}
        {produto.categoriaNome && (
          <p className="text-[0.6rem] font-semibold tracking-[0.14em] uppercase text-grafite-claro truncate">
            {produto.categoriaNome}
          </p>
        )}
        <h3 className="font-semibold text-grafite leading-snug line-clamp-2">{produto.nome}</h3>
        <p className="text-sm text-grafite-claro line-clamp-2 flex-1 mt-0.5">
          {produto.descricao}
        </p>

        <div className="flex items-end justify-between gap-2 mt-3 pt-3 border-t border-linha">
          <p className="font-display text-xl font-semibold text-grafite tracking-tight tabular-nums">
            {formatarPreco(produto.precoCentavos)}
          </p>
          {dosagens.length > 0 && (
            <span className="shrink-0 text-[0.65rem] font-medium text-royal bg-royal-claro px-2 py-1 rounded-full">
              {dosagens.length} dosagens
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
