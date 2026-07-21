"use client";
// Listagem de produtos do painel, com:
// - toggles de 1 clique: Ativo (some/aparece no totem), Novidade, Destaque
// - botões Editar e Apagar (Apagar: só admin)
// - filtro rápido por nome
// - reordenar arrastando (só admin, com o filtro vazio)

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProdutoDTO, TIPO_COMBO, PAPEL_ADMIN } from "@/lib/tipos";
import { formatarPreco } from "@/lib/preco";

export function ListaProdutos({
  produtos,
  papel,
}: {
  produtos: ProdutoDTO[];
  papel: string;
}) {
  const router = useRouter();
  const ehAdmin = papel === PAPEL_ADMIN;
  const [filtro, setFiltro] = useState("");
  const [ocupado, setOcupado] = useState<number | null>(null); // id em atualização

  // Cópia local da lista para o drag-and-drop reordenar na hora
  const [lista, setLista] = useState(produtos);
  useEffect(() => setLista(produtos), [produtos]);

  const listaFiltrada = useMemo(() => {
    const termo = filtro.trim().toLowerCase();
    if (!termo) return lista;
    return lista.filter((p) => p.nome.toLowerCase().includes(termo));
  }, [filtro, lista]);

  // ---------- Drag-and-drop (admin, sem filtro ativo) ----------
  const podeArrastar = ehAdmin && filtro.trim() === "";
  const indiceArrastado = useRef<number | null>(null);

  function aoSoltar(indiceDestino: number) {
    const origem = indiceArrastado.current;
    indiceArrastado.current = null;
    if (origem === null || origem === indiceDestino) return;

    const nova = [...lista];
    const [movido] = nova.splice(origem, 1);
    nova.splice(indiceDestino, 0, movido);
    setLista(nova);

    // Salva a nova ordem no servidor (posição no array = ordem)
    fetch("/api/admin/ordenar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo: "produtos", ids: nova.map((p) => p.id) }),
    }).then(() => router.refresh());
  }

  // Alterna um campo booleano (ativo/novidade/destaque) e recarrega a lista
  async function alternar(p: ProdutoDTO, campo: "ativo" | "novidade" | "destaque") {
    setOcupado(p.id);
    try {
      await fetch(`/api/admin/produtos/${p.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [campo]: !p[campo] }),
      });
      router.refresh();
    } finally {
      setOcupado(null);
    }
  }

  async function apagar(p: ProdutoDTO) {
    // Confirmação nativa simples — evita apagar sem querer
    if (!confirm(`Apagar "${p.nome}" de vez?\n\nDica: se o produto só está em falta, use o botão "Ativo" para escondê-lo do totem sem perder o cadastro.`)) {
      return;
    }
    setOcupado(p.id);
    try {
      await fetch(`/api/admin/produtos/${p.id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setOcupado(null);
    }
  }

  // Botão de toggle (pílula azul/cinza)
  const Toggle = ({
    ligado,
    rotulo,
    aoClicar,
    desabilitado,
  }: {
    ligado: boolean;
    rotulo: string;
    aoClicar: () => void;
    desabilitado: boolean;
  }) => (
    <button
      type="button"
      onClick={aoClicar}
      disabled={desabilitado}
      title={`${rotulo}: ${ligado ? "sim" : "não"} (clique para alternar)`}
      className={`text-xs font-semibold rounded-full px-3 py-1.5 border transition-colors disabled:opacity-50 ${
        ligado
          ? "bg-royal text-white border-royal"
          : "bg-white text-grafite-claro border-grafite/20 hover:border-royal/40"
      }`}
    >
      {rotulo}
    </button>
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-grafite">Produtos</h1>
        <Link
          href="/admin/produtos/novo"
          className="bg-escarlate hover:bg-escarlate-escuro text-white font-bold rounded-xl px-5 py-3 transition-colors"
        >
          + Novo produto
        </Link>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          placeholder="Filtrar por nome..."
          className="w-full max-w-sm border border-grafite/20 rounded-xl px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-royal/50"
        />
        {podeArrastar && (
          <p className="text-sm text-grafite-claro">
            Arraste os cards pelo ⠿ para mudar a ordem no totem.
          </p>
        )}
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {listaFiltrada.length === 0 && (
          <p className="text-grafite-claro py-8 text-center">Nenhum produto encontrado.</p>
        )}

        {listaFiltrada.map((p, indice) => (
          <div
            key={p.id}
            draggable={podeArrastar}
            onDragStart={() => (indiceArrastado.current = indice)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => aoSoltar(indice)}
            className={`bg-white rounded-2xl border border-grafite/10 shadow-sm p-4 flex flex-wrap items-center gap-4 ${
              !p.ativo ? "opacity-60" : ""
            }`}
          >
            {/* Alça de arrastar (só admin) */}
            {podeArrastar && (
              <span
                className="cursor-grab active:cursor-grabbing text-grafite-claro text-xl select-none"
                title="Arraste para reordenar"
              >
                ⠿
              </span>
            )}

            {/* Foto */}
            {p.fotoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.fotoUrl}
                alt={p.nome}
                className="w-16 h-16 rounded-xl object-cover bg-royal-claro shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-royal-claro shrink-0" />
            )}

            {/* Nome / categoria / preço / dosagens */}
            <div className="flex-1 min-w-40">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-grafite">{p.nome}</p>
                {p.tipo === TIPO_COMBO && (
                  <span className="bg-royal text-white text-[0.6rem] font-bold px-2 py-0.5 rounded-full">
                    COMBO
                  </span>
                )}
              </div>
              <p className="text-sm text-grafite-claro">
                {p.categoriaNome ?? "Sem categoria"} · {formatarPreco(p.precoCentavos)}
                {p.dosagens ? ` · ${p.dosagens}` : ""}
              </p>
            </div>

            {/* Toggles */}
            <div className="flex gap-2">
              <Toggle
                ligado={p.ativo}
                rotulo="Ativo"
                aoClicar={() => alternar(p, "ativo")}
                desabilitado={ocupado === p.id}
              />
              <Toggle
                ligado={p.novidade}
                rotulo="Novidade"
                aoClicar={() => alternar(p, "novidade")}
                desabilitado={ocupado === p.id}
              />
              <Toggle
                ligado={p.destaque}
                rotulo="Destaque"
                aoClicar={() => alternar(p, "destaque")}
                desabilitado={ocupado === p.id}
              />
            </div>

            {/* Ações */}
            <div className="flex gap-2">
              <Link
                href={`/admin/produtos/${p.id}/editar`}
                className="border border-royal text-royal hover:bg-royal hover:text-white font-semibold rounded-xl px-4 py-2 text-sm transition-colors"
              >
                Editar
              </Link>
              {ehAdmin && (
                <button
                  type="button"
                  onClick={() => apagar(p)}
                  disabled={ocupado === p.id}
                  className="border border-escarlate text-escarlate hover:bg-escarlate hover:text-white font-semibold rounded-xl px-4 py-2 text-sm transition-colors disabled:opacity-50"
                >
                  Apagar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
