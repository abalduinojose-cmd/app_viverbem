"use client";
// Catálogo do site — busca, filtro por categoria e vitrines.
// Cada card leva à página exclusiva do produto (o link do Instagram).
// O carrinho é global (vive no layout do site).

import { useMemo, useState } from "react";
import { CategoriaDTO, ProdutoDTO, TIPO_COMBO } from "@/lib/tipos";
import { ProdutoCard } from "./ProdutoCard";
import { FaixaProdutos } from "@/components/site/FaixaProdutos";

type Filtro = "tudo" | "novidades" | "combos" | number; // number = id da categoria

export function CatalogoClient({
  categorias,
  produtos,
}: {
  categorias: CategoriaDTO[];
  produtos: ProdutoDTO[];
}) {
  const [filtro, setFiltro] = useState<Filtro>("tudo");
  const [busca, setBusca] = useState("");

  // ---------- Listas derivadas ----------
  const novidades = useMemo(() => produtos.filter((p) => p.novidade), [produtos]);
  const combos = useMemo(() => produtos.filter((p) => p.tipo === TIPO_COMBO), [produtos]);
  const destaques = useMemo(
    () => produtos.filter((p) => p.destaque && p.tipo !== TIPO_COMBO),
    [produtos]
  );

  // Categoria da vitrine especial de dermatologia/estética
  const categoriaDermato = useMemo(
    () => categorias.find((c) => c.slug.includes("dermato") || c.slug.includes("estetica")),
    [categorias]
  );

  const buscando = busca.trim().length > 0;

  const produtosDoFiltro = useMemo(() => {
    if (filtro === "novidades") return novidades;
    if (filtro === "combos") return combos;
    if (typeof filtro === "number") return produtos.filter((p) => p.categoriaId === filtro);
    return produtos;
  }, [filtro, produtos, novidades, combos]);

  // A busca acontece DENTRO da categoria escolhida, então dá para
  // procurar "vitamina" só entre os combos, por exemplo.
  const resultadoBusca = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return [];
    return produtosDoFiltro.filter(
      (p) =>
        p.nome.toLowerCase().includes(termo) || p.descricao.toLowerCase().includes(termo)
    );
  }, [busca, produtosDoFiltro]);

  // Nome da categoria ativa, para o título dos resultados
  const nomeDoFiltro = useMemo(() => {
    if (filtro === "novidades") return "Novidades";
    if (filtro === "combos") return "Combos";
    if (typeof filtro === "number") {
      return categorias.find((c) => c.id === filtro)?.nome ?? null;
    }
    return null;
  }, [filtro, categorias]);

  // Chip de filtro — o selecionado ganha leve elevação e glow
  const Chip = ({
    ativo,
    aoTocar,
    children,
  }: {
    ativo: boolean;
    aoTocar: () => void;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={aoTocar}
      className={`shrink-0 rounded-full px-5 py-2.5 text-sm md:text-base font-medium transition-colors active:scale-95 ${
        ativo
          ? "bg-royal text-white"
          : "bg-white text-grafite-medio border border-linha hover:border-royal/40 hover:text-royal"
      }`}
    >
      {children}
    </button>
  );

  const TituloSecao = ({
    selo,
    children,
  }: {
    selo?: string;
    children: React.ReactNode;
  }) => (
    <div className="mb-5">
      {selo && <p className="selo-secao text-escarlate">{selo}</p>}
      <h2 className="font-display text-2xl md:text-3xl font-semibold text-grafite tracking-tight mt-1">
        {children}
      </h2>
    </div>
  );

  const Grade = ({ lista }: { lista: ProdutoDTO[] }) =>
    lista.length === 0 ? (
      <div className="py-16 text-center">
        <p className="font-display text-xl font-semibold text-grafite">
          Nenhum produto encontrado
        </p>
        <p className="text-grafite-claro mt-1">
          Tente outra palavra ou escolha outra categoria acima.
        </p>
      </div>
    ) : (
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
        {lista.map((p) => (
          <ProdutoCard key={p.id} produto={p} />
        ))}
      </div>
    );

  return (
    <div className="flex-1 flex flex-col min-h-screen pt-16 md:pt-[4.5rem]">
      {/* ---------- Abertura da página ---------- */}
      <div className="halo-marca px-4 md:px-8 pt-10 pb-7">
        <div className="max-w-7xl mx-auto">
          <p className="selo-secao text-escarlate">o que a gente prepara</p>
          <h1 className="font-display text-3xl md:text-[2.8rem] font-semibold text-grafite tracking-tight leading-tight mt-2">
            Nossos <span className="italic text-royal">produtos</span>
          </h1>
        </div>
      </div>

      {/* ---------- Barra de busca e filtros (gruda abaixo do header) ---------- */}
      <div className="sticky top-16 md:top-[4.5rem] z-40 bg-white/95 backdrop-blur-md border-y border-linha">
        <div className="flex items-center gap-4 px-4 md:px-8 pt-4 pb-3 max-w-7xl mx-auto w-full">
          {/* Busca */}
          <div className="flex-1 relative max-w-2xl mx-auto">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 text-grafite-claro"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar produto..."
              className="w-full bg-royal-nevoa border border-linha rounded-2xl pl-11 pr-11 py-3 text-base text-grafite placeholder:text-grafite-claro focus:outline-none focus:ring-2 focus:ring-royal/40 focus:border-royal/40 focus:bg-white transition-colors"
            />
            {buscando && (
              <button
                type="button"
                onClick={() => setBusca("")}
                aria-label="Limpar busca"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-grafite-claro hover:text-grafite w-7 h-7 flex items-center justify-center"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Chips de categoria — ficam visíveis também durante a busca,
            para dar para procurar dentro de uma categoria */}
        <div className="flex gap-2.5 overflow-x-auto rolagem-sem-barra px-4 md:px-8 pb-3.5 max-w-7xl mx-auto w-full">
          <Chip ativo={filtro === "tudo"} aoTocar={() => setFiltro("tudo")}>
            {buscando ? "Em tudo" : "Tudo"}
          </Chip>
          {novidades.length > 0 && (
            <Chip ativo={filtro === "novidades"} aoTocar={() => setFiltro("novidades")}>
              Novidades
            </Chip>
          )}
          {categorias.map((c) => (
            <Chip key={c.id} ativo={filtro === c.id} aoTocar={() => setFiltro(c.id)}>
              {c.nome}
            </Chip>
          ))}
          {/* Combos por último */}
          {combos.length > 0 && (
            <Chip ativo={filtro === "combos"} aoTocar={() => setFiltro("combos")}>
              Combos
            </Chip>
          )}
        </div>
      </div>

      {/* ---------- Conteúdo ---------- */}
      <main className="flex-1 px-4 md:px-8 py-8 pb-24 max-w-7xl mx-auto w-full">
        {buscando ? (
          <>
            <h2 className="font-display text-2xl font-semibold text-grafite mb-1 tracking-tight">
              {resultadoBusca.length}{" "}
              {resultadoBusca.length === 1 ? "resultado" : "resultados"} para “
              {busca.trim()}”
            </h2>
            <p className="text-grafite-claro mb-5">
              {nomeDoFiltro ? (
                <>
                  em <b className="text-grafite-medio">{nomeDoFiltro}</b>.{" "}
                  <button
                    type="button"
                    onClick={() => setFiltro("tudo")}
                    className="text-royal font-medium hover:underline"
                  >
                    Procurar no catálogo todo
                  </button>
                </>
              ) : (
                "em todo o catálogo. Toque numa categoria acima para restringir."
              )}
            </p>
            <Grade lista={resultadoBusca} />
          </>
        ) : filtro === "tudo" ? (
          <div className="flex flex-col gap-12">
            {/* Vitrine: Mais procurados (primeira da página) */}
            {destaques.length > 0 && (
              <section>
                <TituloSecao selo="os queridinhos">Mais procurados</TituloSecao>
                <FaixaProdutos largura="estreita" produtos={destaques} />
              </section>
            )}

            {/* Vitrine: Novidades */}
            {novidades.length > 0 && (
              <section>
                <TituloSecao selo="acabou de chegar">Novidades</TituloSecao>
                <FaixaProdutos largura="estreita" produtos={novidades} />
              </section>
            )}

            {/* Vitrine especial: linha dermatológica/estética */}
            {categoriaDermato && (
              <section className="bg-royal rounded-[1.75rem] p-8 md:p-12 text-white relative overflow-hidden">
                <div className="relative max-w-lg">
                  <p className="selo-secao text-white/60">beleza autêntica</p>
                  <h2 className="font-display text-2xl md:text-3xl font-semibold mt-2 tracking-tight leading-tight">
                    Cuidados dermatológicos <span className="italic">sob medida</span>
                  </h2>
                  <p className="text-white/80 mt-3 text-base leading-relaxed">
                    Cremes, séruns e fórmulas estéticas personalizadas para a sua pele, porque
                    autoestima também é saúde.
                  </p>
                  <button
                    type="button"
                    onClick={() => setFiltro(categoriaDermato.id)}
                    className="mt-6 inline-flex items-center gap-2 bg-white text-royal font-semibold rounded-2xl px-7 py-3.5 text-base active:scale-95 transition-transform"
                  >
                    Ver linha completa
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M5 12h14m0 0-6-6m6 6-6 6"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
                <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-white/5" aria-hidden="true" />
                <div className="absolute right-10 top-8 w-32 h-32 rounded-full bg-white/5" aria-hidden="true" />
              </section>
            )}

            {/* Catálogo completo por categoria */}
            {categorias.map((c) => {
              const lista = produtos.filter((p) => p.categoriaId === c.id);
              if (lista.length === 0) return null;
              return (
                <section key={c.id}>
                  <TituloSecao>{c.nome}</TituloSecao>
                  <Grade lista={lista} />
                </section>
              );
            })}

            {/* Vitrine: Combos — sempre por último */}
            {combos.length > 0 && (
              <section>
                <TituloSecao selo="mais completo, mais vantajoso">Combos especiais</TituloSecao>
                <FaixaProdutos largura="estreita" produtos={combos} />
              </section>
            )}
          </div>
        ) : (
          <Grade lista={produtosDoFiltro} />
        )}
      </main>
    </div>
  );
}
