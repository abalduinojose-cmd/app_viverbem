// Card de produto — leva à página exclusiva do produto (o mesmo
// endereço que é divulgado no Instagram). Foto em proporção fixa,
// selos discretos, nome, descrição e preço.
import Link from "next/link";
import { ProdutoDTO, TIPO_COMBO, listarDosagens } from "@/lib/tipos";
import { formatarPreco } from "@/lib/preco";
import { FotoProduto } from "./FotoProduto";

export function ProdutoCard({ produto }: { produto: ProdutoDTO }) {
  const temDosagem = listarDosagens(produto.dosagens).length > 0;

  return (
    <Link
      href={`/produto/${produto.slug}`}
      className="group animar-surgir text-left bg-white rounded-3xl sombra-card hover:sombra-card-hover border border-linha overflow-hidden active:scale-[0.98] transition-all duration-200 flex flex-col w-full h-full"
    >
      <div className="relative p-3 pb-0">
        <div className="relative rounded-2xl overflow-hidden bg-royal-nevoa aspect-square">
          <FotoProduto
            fotoUrl={produto.fotoUrl}
            nome={produto.nome}
            className="w-full h-full group-hover:scale-[1.03] transition-transform duration-300"
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
        </div>
      </div>

      <div className="p-4 flex flex-col gap-1.5 flex-1">
        <h3 className="font-semibold text-grafite leading-snug line-clamp-2">{produto.nome}</h3>
        <p className="text-sm text-grafite-claro line-clamp-2 flex-1">{produto.descricao}</p>
        <div className="flex items-end justify-between mt-1.5">
          <p className="text-royal font-bold text-xl tracking-tight">
            {formatarPreco(produto.precoCentavos)}
          </p>
          {temDosagem && (
            <span className="text-[0.65rem] font-medium text-grafite-medio bg-royal-claro px-2 py-1 rounded-full">
              dosagens
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
