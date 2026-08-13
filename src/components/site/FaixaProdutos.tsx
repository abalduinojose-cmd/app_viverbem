"use client";
// Faixa horizontal de produtos.
//
// No celular a rolagem é a nativa do toque, que já funciona bem e não
// precisa de setas. No computador, onde arrastar com o mouse não faz
// nada por padrão, ligamos o "clique e arraste" — só para mouse, para
// não atrapalhar o toque.
//
// O cuidado principal é não transformar um arrasto em clique no
// produto: se o dedo/mouse andou, o clique seguinte é engolido.

import { useRef, useState } from "react";
import { ProdutoDTO } from "@/lib/tipos";
import { ProdutoCard } from "@/components/totem/ProdutoCard";

// A partir de quantos pixels consideramos que foi arrasto, e não clique
const TOLERANCIA = 6;

export function FaixaProdutos({
  produtos,
  largura = "padrao",
}: {
  produtos: ProdutoDTO[];
  /** "estreita" nas grades do catálogo, "padrao" nas vitrines da home */
  largura?: "padrao" | "estreita";
}) {
  const faixaRef = useRef<HTMLDivElement>(null);
  const inicio = useRef({ x: 0, scroll: 0, andou: 0 });
  const [arrastando, setArrastando] = useState(false);

  function aoPressionar(e: React.PointerEvent<HTMLDivElement>) {
    // Toque e caneta seguem com a rolagem nativa
    if (e.pointerType !== "mouse") return;
    const faixa = faixaRef.current;
    if (!faixa) return;
    inicio.current = { x: e.clientX, scroll: faixa.scrollLeft, andou: 0 };
    setArrastando(true);
  }

  function aoMover(e: React.PointerEvent<HTMLDivElement>) {
    if (!arrastando) return;
    const faixa = faixaRef.current;
    if (!faixa) return;
    const distancia = e.clientX - inicio.current.x;
    inicio.current.andou = Math.max(inicio.current.andou, Math.abs(distancia));
    faixa.scrollLeft = inicio.current.scroll - distancia;
  }

  function aoSoltar() {
    if (arrastando) setArrastando(false);
  }

  // Arrastou? Então o clique que vem a seguir não deve abrir o produto
  function aoClicar(e: React.MouseEvent<HTMLDivElement>) {
    if (inicio.current.andou > TOLERANCIA) {
      e.preventDefault();
      e.stopPropagation();
      inicio.current.andou = 0;
    }
  }

  const classeItem =
    largura === "estreita" ? "w-52 md:w-64 shrink-0 snap-start" : "w-56 md:w-64 shrink-0 snap-start";

  return (
    <div
      ref={faixaRef}
      onPointerDown={aoPressionar}
      onPointerMove={aoMover}
      onPointerUp={aoSoltar}
      onPointerLeave={aoSoltar}
      onClickCapture={aoClicar}
      className={`flex gap-4 md:gap-5 overflow-x-auto rolagem-sem-barra pb-2 -mx-1 px-1 snap-x md:cursor-grab ${
        arrastando ? "md:cursor-grabbing select-none snap-none" : ""
      }`}
    >
      {produtos.map((p) => (
        <div key={p.id} className={classeItem}>
          <ProdutoCard produto={p} />
        </div>
      ))}
    </div>
  );
}
