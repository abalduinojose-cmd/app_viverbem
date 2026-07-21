"use client";
// Avaliações do Google em carrossel horizontal (rola para o lado),
// com foto do cliente (ou inicial do nome), estrelas e selo do Google.

import { useRef } from "react";
import { DepoimentoDTO } from "@/lib/tipos";
import { Estrelas } from "./Estrelas";

// Logotipo "G" do Google
function IconeGoogle({ tamanho = 20 }: { tamanho?: number }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z" />
      <path fill="#34A853" d="M12 24c3.2 0 6-1.1 7.9-3l-3.9-3c-1 .7-2.4 1.1-4 1.1-3 0-5.6-2-6.6-4.8h-4v3.1A12 12 0 0 0 12 24z" />
      <path fill="#FBBC04" d="M5.4 14.3a7.2 7.2 0 0 1 0-4.6v-3.1h-4a12 12 0 0 0 0 10.8l4-3.1z" />
      <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.5 1.8l3.4-3.4A12 12 0 0 0 1.4 6.6l4 3.1C6.4 6.8 9 4.8 12 4.8z" />
    </svg>
  );
}

export function CarrosselAvaliacoes({
  avaliacoes,
  media,
}: {
  avaliacoes: DepoimentoDTO[];
  media: number;
}) {
  const faixaRef = useRef<HTMLDivElement>(null);

  // Rola uma "página" de cards para o lado
  function rolar(direcao: -1 | 1) {
    const faixa = faixaRef.current;
    if (!faixa) return;
    faixa.scrollBy({ left: direcao * (faixa.clientWidth * 0.8), behavior: "smooth" });
  }

  const SetaBotao = ({ direcao, rotulo }: { direcao: -1 | 1; rotulo: string }) => (
    <button
      type="button"
      onClick={() => rolar(direcao)}
      aria-label={rotulo}
      className="w-12 h-12 rounded-full bg-white border border-linha text-grafite-medio hover:text-royal hover:border-royal/40 sombra-card flex items-center justify-center active:scale-90 transition-all"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d={direcao === -1 ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );

  return (
    <section className="mt-16">
      <div className="px-4 md:px-8 max-w-6xl mx-auto">
        {/* Cabeçalho: nota média + setas */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex items-center gap-4">
            <IconeGoogle tamanho={40} />
            <div>
              <p className="text-xs font-semibold tracking-[0.22em] uppercase text-grafite-claro">
                Avaliações no Google
              </p>
              <div className="flex items-center gap-2.5 mt-1">
                <span className="text-3xl font-bold text-grafite tracking-tight leading-none">
                  {media.toFixed(1)}
                </span>
                <Estrelas nota={Math.round(media)} tamanho={20} />
                <span className="text-sm text-grafite-claro">
                  ({avaliacoes.length} avaliações)
                </span>
              </div>
            </div>
          </div>

          {/* Setas do carrossel */}
          <div className="flex gap-2">
            <SetaBotao direcao={-1} rotulo="Ver avaliações anteriores" />
            <SetaBotao direcao={1} rotulo="Ver próximas avaliações" />
          </div>
        </div>
      </div>

      {/* Faixa rolável */}
      <div
        ref={faixaRef}
        className="flex gap-5 overflow-x-auto rolagem-sem-barra mt-7 px-4 md:px-8 pb-3 snap-x snap-mandatory"
      >
        {/* espaçador para alinhar com o container central em telas largas */}
        <div className="shrink-0 w-0 md:w-[max(0px,calc((100vw-72rem)/2))]" aria-hidden="true" />

        {avaliacoes.map((a) => (
          <figure
            key={a.id}
            className="snap-start shrink-0 w-[19rem] md:w-[22rem] bg-white rounded-[1.75rem] border border-linha sombra-card p-7 flex flex-col"
          >
            <div className="flex items-center gap-3.5">
              {/* Foto do cliente ou inicial do nome */}
              {a.fotoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={a.fotoUrl}
                  alt={a.nome}
                  className="w-14 h-14 rounded-full object-cover border border-linha"
                  draggable={false}
                />
              ) : (
                <span className="w-14 h-14 rounded-full degrade-marca text-white flex items-center justify-center font-bold text-xl">
                  {a.nome.charAt(0).toUpperCase()}
                </span>
              )}
              <div className="min-w-0 flex-1">
                <figcaption className="font-semibold text-grafite truncate">{a.nome}</figcaption>
                <Estrelas nota={a.nota} tamanho={16} />
              </div>
              {a.fonte === "Google" && <IconeGoogle tamanho={22} />}
            </div>

            <blockquote className="text-grafite-medio leading-relaxed mt-5 flex-1">
              “{a.texto}”
            </blockquote>
          </figure>
        ))}

        <div className="shrink-0 w-2" aria-hidden="true" />
      </div>
    </section>
  );
}
