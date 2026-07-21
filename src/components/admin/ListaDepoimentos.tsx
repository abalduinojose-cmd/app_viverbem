"use client";
// Gestão de avaliações/depoimentos: criar, editar, ativar/desativar e apagar.
// Cada avaliação tem nota (estrelas), fonte (Google/Loja), nome e texto.
// Os ativos aparecem na página "Como funciona" do totem.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DepoimentoDTO } from "@/lib/tipos";

// Seletor de estrelas clicável
function SeletorNota({ nota, aoMudar }: { nota: number; aoMudar: (n: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => aoMudar(i)}
          aria-label={`${i} estrela${i > 1 ? "s" : ""}`}
          className="active:scale-90 transition-transform"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill={i <= nota ? "#FBBC04" : "#E7EBF0"}>
            <path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5L2.6 9.3l6.5-.9L12 2.5z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

// Estrelas só de leitura (na lista)
function EstrelasLeitura({ nota }: { nota: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="15" height="15" viewBox="0 0 24 24" fill={i <= nota ? "#FBBC04" : "#E7EBF0"}>
          <path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5L2.6 9.3l6.5-.9L12 2.5z" />
        </svg>
      ))}
    </div>
  );
}

export function ListaDepoimentos({ depoimentos }: { depoimentos: DepoimentoDTO[] }) {
  const router = useRouter();
  const [novoNome, setNovoNome] = useState("");
  const [novoTexto, setNovoTexto] = useState("");
  const [novaNota, setNovaNota] = useState(5);
  const [novaFonte, setNovaFonte] = useState("Google");
  const [editando, setEditando] = useState<number | null>(null);
  const [nomeEdicao, setNomeEdicao] = useState("");
  const [textoEdicao, setTextoEdicao] = useState("");
  const [notaEdicao, setNotaEdicao] = useState(5);
  const [erro, setErro] = useState("");
  const [ocupado, setOcupado] = useState(false);

  async function criar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setOcupado(true);
    try {
      const resposta = await fetch("/api/admin/depoimentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: novoNome, texto: novoTexto, nota: novaNota, fonte: novaFonte }),
      });
      const dados = await resposta.json();
      if (!resposta.ok) {
        setErro(dados.erro || "Não foi possível criar.");
        return;
      }
      setNovoNome("");
      setNovoTexto("");
      setNovaNota(5);
      router.refresh();
    } finally {
      setOcupado(false);
    }
  }

  async function salvarEdicao(id: number) {
    setOcupado(true);
    try {
      await fetch(`/api/admin/depoimentos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: nomeEdicao, texto: textoEdicao, nota: notaEdicao }),
      });
      setEditando(null);
      router.refresh();
    } finally {
      setOcupado(false);
    }
  }

  async function alternarAtivo(d: DepoimentoDTO) {
    setOcupado(true);
    try {
      await fetch(`/api/admin/depoimentos/${d.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ativo: !d.ativo }),
      });
      router.refresh();
    } finally {
      setOcupado(false);
    }
  }

  async function apagar(d: DepoimentoDTO) {
    if (!confirm(`Apagar a avaliação de "${d.nome}"?`)) return;
    setOcupado(true);
    try {
      await fetch(`/api/admin/depoimentos/${d.id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setOcupado(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-grafite">Avaliações</h1>
      <p className="text-grafite-claro mt-1">
        As avaliações ativas aparecem na página “Como funciona a manipulação” do totem. Para
        exibir as avaliações reais do Google, copie o texto e a nota de cada uma e cadastre aqui.
      </p>

      {/* Criar nova */}
      <form
        onSubmit={criar}
        className="mt-5 bg-white rounded-2xl border border-grafite/10 shadow-sm p-5 flex flex-col gap-3"
      >
        <input
          value={novoNome}
          onChange={(e) => setNovoNome(e.target.value)}
          required
          placeholder="Nome do cliente (ex.: Maria Helena)"
          className="border border-grafite/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-royal/50"
        />
        <textarea
          value={novoTexto}
          onChange={(e) => setNovoTexto(e.target.value)}
          required
          rows={3}
          placeholder="Texto da avaliação..."
          className="border border-grafite/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-royal/50 resize-y"
        />
        <div className="flex flex-wrap items-center gap-5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-grafite">Nota:</span>
            <SeletorNota nota={novaNota} aoMudar={setNovaNota} />
          </div>
          <label className="flex items-center gap-2">
            <span className="text-sm font-medium text-grafite">Fonte:</span>
            <select
              value={novaFonte}
              onChange={(e) => setNovaFonte(e.target.value)}
              className="border border-grafite/20 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-royal/50"
            >
              <option value="Google">Google</option>
              <option value="Loja">Loja</option>
            </select>
          </label>
          <button
            type="submit"
            disabled={ocupado}
            className="ml-auto bg-escarlate hover:bg-escarlate-escuro disabled:opacity-60 text-white font-bold rounded-xl px-5 py-3 transition-colors"
          >
            + Adicionar
          </button>
        </div>
      </form>

      {erro && (
        <p className="mt-3 bg-escarlate/10 text-escarlate text-sm font-medium rounded-xl px-4 py-3">
          {erro}
        </p>
      )}

      {/* Lista */}
      <div className="mt-5 flex flex-col gap-3">
        {depoimentos.length === 0 && (
          <p className="text-grafite-claro py-8 text-center">Nenhuma avaliação cadastrada.</p>
        )}

        {depoimentos.map((d) => (
          <div
            key={d.id}
            className={`bg-white rounded-2xl border border-grafite/10 shadow-sm p-5 ${
              !d.ativo ? "opacity-60" : ""
            }`}
          >
            {editando === d.id ? (
              <div className="flex flex-col gap-3">
                <input
                  value={nomeEdicao}
                  onChange={(e) => setNomeEdicao(e.target.value)}
                  className="border border-royal/40 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-royal/50"
                />
                <textarea
                  value={textoEdicao}
                  onChange={(e) => setTextoEdicao(e.target.value)}
                  rows={3}
                  className="border border-royal/40 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-royal/50 resize-y"
                />
                <SeletorNota nota={notaEdicao} aoMudar={setNotaEdicao} />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => salvarEdicao(d.id)}
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
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <EstrelasLeitura nota={d.nota} />
                  {d.fonte === "Google" && (
                    <span className="text-xs font-semibold text-grafite-claro">via Google</span>
                  )}
                </div>
                <p className="text-grafite leading-relaxed mt-2">“{d.texto}”</p>
                <p className="text-royal font-semibold mt-2">— {d.nome}</p>
                <div className="flex gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => alternarAtivo(d)}
                    disabled={ocupado}
                    className={`text-xs font-semibold rounded-full px-3 py-1.5 border transition-colors disabled:opacity-50 ${
                      d.ativo
                        ? "bg-royal text-white border-royal"
                        : "bg-white text-grafite-claro border-grafite/20"
                    }`}
                  >
                    {d.ativo ? "Ativo" : "Inativo"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditando(d.id);
                      setNomeEdicao(d.nome);
                      setTextoEdicao(d.texto);
                      setNotaEdicao(d.nota);
                    }}
                    className="border border-royal text-royal hover:bg-royal hover:text-white font-semibold rounded-xl px-4 py-1.5 text-sm transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => apagar(d)}
                    disabled={ocupado}
                    className="border border-escarlate text-escarlate hover:bg-escarlate hover:text-white font-semibold rounded-xl px-4 py-1.5 text-sm transition-colors disabled:opacity-50"
                  >
                    Apagar
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
