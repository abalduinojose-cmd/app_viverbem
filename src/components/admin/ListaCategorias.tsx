"use client";
// Gestão de categorias: criar, renomear, apagar e reordenar arrastando
// (a ordem aqui é a ordem dos chips e seções no site).

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface CategoriaComTotal {
  id: number;
  nome: string;
  slug: string;
  ordem: number;
  totalProdutos: number;
}

export function ListaCategorias({ categorias }: { categorias: CategoriaComTotal[] }) {
  const router = useRouter();
  const [novoNome, setNovoNome] = useState("");
  const [editando, setEditando] = useState<number | null>(null);
  const [nomeEdicao, setNomeEdicao] = useState("");
  const [erro, setErro] = useState("");
  const [ocupado, setOcupado] = useState(false);

  // Cópia local para o drag-and-drop reordenar na hora
  const [lista, setLista] = useState(categorias);
  useEffect(() => setLista(categorias), [categorias]);
  const indiceArrastado = useRef<number | null>(null);

  function aoSoltar(indiceDestino: number) {
    const origem = indiceArrastado.current;
    indiceArrastado.current = null;
    if (origem === null || origem === indiceDestino) return;

    const nova = [...lista];
    const [movida] = nova.splice(origem, 1);
    nova.splice(indiceDestino, 0, movida);
    setLista(nova);

    fetch("/api/admin/ordenar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo: "categorias", ids: nova.map((c) => c.id) }),
    }).then(() => router.refresh());
  }

  async function criar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setOcupado(true);
    try {
      const resposta = await fetch("/api/admin/categorias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: novoNome }),
      });
      const dados = await resposta.json();
      if (!resposta.ok) {
        setErro(dados.erro || "Não foi possível criar.");
        return;
      }
      setNovoNome("");
      router.refresh();
    } finally {
      setOcupado(false);
    }
  }

  async function renomear(id: number) {
    setErro("");
    setOcupado(true);
    try {
      const resposta = await fetch(`/api/admin/categorias/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: nomeEdicao }),
      });
      const dados = await resposta.json();
      if (!resposta.ok) {
        setErro(dados.erro || "Não foi possível renomear.");
        return;
      }
      setEditando(null);
      router.refresh();
    } finally {
      setOcupado(false);
    }
  }

  async function apagar(c: CategoriaComTotal) {
    const aviso =
      c.totalProdutos > 0
        ? `Apagar a categoria "${c.nome}"?\n\nOs ${c.totalProdutos} produto(s) dela NÃO serão apagados — ficarão "sem categoria".`
        : `Apagar a categoria "${c.nome}"?`;
    if (!confirm(aviso)) return;

    setOcupado(true);
    try {
      await fetch(`/api/admin/categorias/${c.id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setOcupado(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-grafite">Categorias</h1>

      {/* Criar nova */}
      <form onSubmit={criar} className="mt-5 flex gap-3">
        <input
          value={novoNome}
          onChange={(e) => setNovoNome(e.target.value)}
          required
          placeholder="Nome da nova categoria..."
          className="flex-1 border border-grafite/20 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-royal/50"
        />
        <button
          type="submit"
          disabled={ocupado}
          className="bg-escarlate hover:bg-escarlate-escuro disabled:opacity-60 text-white font-bold rounded-xl px-5 py-3 transition-colors"
        >
          + Criar
        </button>
      </form>

      {erro && (
        <p className="mt-3 bg-escarlate/10 text-escarlate text-sm font-medium rounded-xl px-4 py-3">
          {erro}
        </p>
      )}

      <p className="mt-4 text-sm text-grafite-claro">
        Arraste os cartões pela alça para mudar a ordem das categorias no site.
      </p>

      {/* Lista */}
      <div className="mt-3 flex flex-col gap-3">
        {lista.map((c, indice) => (
          <div
            key={c.id}
            draggable
            onDragStart={() => (indiceArrastado.current = indice)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => aoSoltar(indice)}
            className="bg-white rounded-2xl border border-linha p-4 flex items-center gap-4"
          >
            <span
              className="cursor-grab active:cursor-grabbing text-grafite-claro hover:text-royal select-none transition-colors"
              title="Arraste para reordenar"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <circle cx="9" cy="6" r="1.6" /><circle cx="15" cy="6" r="1.6" />
                <circle cx="9" cy="12" r="1.6" /><circle cx="15" cy="12" r="1.6" />
                <circle cx="9" cy="18" r="1.6" /><circle cx="15" cy="18" r="1.6" />
              </svg>
            </span>
            {editando === c.id ? (
              <>
                <input
                  value={nomeEdicao}
                  onChange={(e) => setNomeEdicao(e.target.value)}
                  autoFocus
                  className="flex-1 border border-royal/40 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-royal/50"
                />
                <button
                  type="button"
                  onClick={() => renomear(c.id)}
                  disabled={ocupado}
                  className="bg-royal text-white font-semibold rounded-xl px-4 py-2 text-sm disabled:opacity-50"
                >
                  Salvar
                </button>
                <button
                  type="button"
                  onClick={() => setEditando(null)}
                  className="text-grafite-claro text-sm font-semibold px-2"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <div className="flex-1">
                  <p className="font-semibold text-grafite">{c.nome}</p>
                  <p className="text-sm text-grafite-claro">
                    {c.totalProdutos} produto{c.totalProdutos === 1 ? "" : "s"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditando(c.id);
                    setNomeEdicao(c.nome);
                  }}
                  className="border border-royal text-royal hover:bg-royal hover:text-white font-semibold rounded-xl px-4 py-2 text-sm transition-colors"
                >
                  Renomear
                </button>
                <button
                  type="button"
                  onClick={() => apagar(c)}
                  disabled={ocupado}
                  className="border border-escarlate text-escarlate hover:bg-escarlate hover:text-white font-semibold rounded-xl px-4 py-2 text-sm transition-colors disabled:opacity-50"
                >
                  Apagar
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
