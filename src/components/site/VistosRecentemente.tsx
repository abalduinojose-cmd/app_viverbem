"use client";
// Histórico de produtos que a pessoa abriu, guardado no próprio
// navegador (nada vai para o servidor). Serve para ela retomar de
// onde parou e continuar montando o pedido.
//
// Guardamos só os slugs; os dados vêm do catálogo que a página passa.

import { useEffect, useState } from "react";
import { ProdutoDTO } from "@/lib/tipos";
import { FaixaProdutos } from "./FaixaProdutos";

const CHAVE = "viverbem:vistos";
const LIMITE = 12;

function lerHistorico(): string[] {
  try {
    const bruto = localStorage.getItem(CHAVE);
    const lista = bruto ? JSON.parse(bruto) : [];
    return Array.isArray(lista) ? lista.filter((s) => typeof s === "string") : [];
  } catch {
    // Modo privado ou storage cheio: seguimos sem histórico
    return [];
  }
}

export function VistosRecentemente({
  slugAtual,
  catalogo,
}: {
  slugAtual: string;
  catalogo: ProdutoDTO[];
}) {
  const [vistos, setVistos] = useState<ProdutoDTO[]>([]);

  useEffect(() => {
    const anteriores = lerHistorico();

    // Mostra o que a pessoa já tinha visto ANTES de abrir esta página
    const porSlug = new Map(catalogo.map((p) => [p.slug, p]));
    setVistos(
      anteriores
        .filter((s) => s !== slugAtual)
        .map((s) => porSlug.get(s))
        .filter((p): p is ProdutoDTO => Boolean(p))
    );

    // E registra o produto atual no topo da lista
    try {
      const atualizado = [slugAtual, ...anteriores.filter((s) => s !== slugAtual)];
      localStorage.setItem(CHAVE, JSON.stringify(atualizado.slice(0, LIMITE)));
    } catch {
      // Sem storage não dá para lembrar, e tudo bem
    }
  }, [slugAtual, catalogo]);

  if (vistos.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 md:px-8 pt-4 pb-20">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <p className="palavra-script text-2xl text-royal">continue de onde parou</p>
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-grafite mt-1">
            Você viu recentemente
          </h2>
        </div>
      </div>
      <FaixaProdutos produtos={vistos} />
    </section>
  );
}
