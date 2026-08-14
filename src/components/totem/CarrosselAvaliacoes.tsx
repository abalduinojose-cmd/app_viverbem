"use client";
// Avaliações do Google em carrossel horizontal (rola para o lado),
// com foto do cliente (ou inicial do nome), estrelas e selo do Google.

import { useRef } from "react";
import {
  DepoimentoDTO,
  AVALIACOES_GOOGLE_TOTAL,
  PERFIL_GOOGLE_URL,
} from "@/lib/tipos";
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
        <div className="md:text-center md:max-w-2xl md:mx-auto">
          <p className="selo-secao text-escarlate">quem já é cliente</p>
          <h2 className="font-display text-3xl md:text-[2.6rem] font-semibold text-grafite leading-tight mt-2">
            O que dizem <span className="italic text-royal">sobre a gente</span>
          </h2>

          {/* Nota do perfil: uma pílula compacta, centralizada no desktop */}
          <a
            href={PERFIL_GOOGLE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-5 inline-flex items-center gap-3 md:gap-4 bg-white border border-linha rounded-full sombra-card hover:sombra-card-hover hover:border-royal/30 pl-4 pr-5 py-2.5 transition-all"
          >
            <IconeGoogle tamanho={26} />
            <span className="flex items-baseline gap-2">
              <span className="font-display text-2xl font-semibold text-grafite leading-none tabular-nums">
                {media.toLocaleString("pt-BR", { minimumFractionDigits: 1 })}
              </span>
              <Estrelas nota={Math.round(media)} tamanho={15} />
            </span>
            <span className="hidden sm:inline text-grafite-claro text-sm">
              {AVALIACOES_GOOGLE_TOTAL} avaliações
            </span>
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              className="text-grafite-claro group-hover:text-royal transition-colors"
            >
              <path d="M7 17 17 7m0 0H8m9 0v9" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
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
            className="relative snap-start shrink-0 w-[17.5rem] md:w-[22rem] bg-white rounded-[1.75rem] border border-linha sombra-card hover:sombra-card-hover hover:-translate-y-1 p-6 md:p-7 flex flex-col transition-all duration-300"
          >
            {/* Aspas decorativas, marcando que é um depoimento */}
            <span
              aria-hidden="true"
              className="absolute top-4 right-6 font-display text-6xl leading-none text-royal/10 select-none"
            >
              ”
            </span>

            <div className="relative flex items-center gap-3.5">
              {/* Foto do cliente ou inicial do nome */}
              {a.fotoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={a.fotoUrl}
                  alt={a.nome}
                  loading="lazy"
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow-[0_2px_10px_rgba(16,42,74,0.15)]"
                  draggable={false}
                />
              ) : (
                <span className="w-14 h-14 rounded-full degrade-marca text-white flex items-center justify-center font-bold text-xl">
                  {a.nome.charAt(0).toUpperCase()}
                </span>
              )}
              <div className="min-w-0 flex-1">
                <figcaption className="font-semibold text-grafite truncate">{a.nome}</figcaption>
                <div className="flex items-center gap-2 mt-0.5">
                  <Estrelas nota={a.nota} tamanho={15} />
                  {a.fonte === "Google" && <IconeGoogle tamanho={14} />}
                </div>
              </div>
            </div>

            <blockquote className="relative text-grafite-medio leading-relaxed mt-5 flex-1">
              {a.texto}
            </blockquote>
          </figure>
        ))}

        <div className="shrink-0 w-2" aria-hidden="true" />
      </div>

      {/* Setas embaixo e centralizadas, para acompanhar o cabeçalho.
          No celular a pessoa arrasta, então elas nem aparecem. */}
      <div className="hidden sm:flex justify-center gap-3 mt-7">
        <SetaBotao direcao={-1} rotulo="Ver avaliações anteriores" />
        <SetaBotao direcao={1} rotulo="Ver próximas avaliações" />
      </div>
    </section>
  );
}
