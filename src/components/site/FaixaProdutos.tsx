// Faixa horizontal de produtos (rolagem lateral por toque/arrasto),
// usada nas seções da home. Cada card leva à página do produto.
import { ProdutoDTO } from "@/lib/tipos";
import { ProdutoCard } from "@/components/totem/ProdutoCard";

export function FaixaProdutos({ produtos }: { produtos: ProdutoDTO[] }) {
  return (
    <div className="flex gap-4 md:gap-5 overflow-x-auto rolagem-sem-barra pb-2 -mx-1 px-1 snap-x">
      {produtos.map((p) => (
        <div key={p.id} className="w-56 md:w-64 shrink-0 snap-start">
          <ProdutoCard produto={p} />
        </div>
      ))}
    </div>
  );
}
