"use client";
// Os números da farmácia, que sobem contando quando entram na tela.
// A contagem só roda uma vez, e quem pediu menos movimento no sistema
// já vê o valor final direto.

import { useEffect, useRef, useState } from "react";
import {
  ANOS_TRADICAO,
  UNIDADES,
  AVALIACOES_GOOGLE_NOTA,
  AVALIACOES_GOOGLE_TOTAL,
  PERFIL_GOOGLE_URL,
} from "@/lib/tipos";

const DURACAO = 1400; // ms da contagem

const NUMEROS = [
  {
    alvo: ANOS_TRADICAO,
    decimais: 0,
    sufixo: "",
    rotulo: "anos de tradição",
    icone: (
      <>
        <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
        <path d="M12 7.5v5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    alvo: UNIDADES.length,
    decimais: 0,
    sufixo: "",
    rotulo: "unidades em Petrópolis",
    icone: (
      <>
        <path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.6" />
      </>
    ),
  },
  {
    alvo: AVALIACOES_GOOGLE_NOTA,
    decimais: 1,
    sufixo: "",
    rotulo: `nota no Google, em ${AVALIACOES_GOOGLE_TOTAL} avaliações`,
    link: PERFIL_GOOGLE_URL,
    icone: (
      <path
        d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    ),
  },
  {
    alvo: 100,
    decimais: 0,
    sufixo: "%",
    rotulo: "fórmulas sob medida",
    icone: (
      <>
        <path d="M6 4.5h12M8 4.5v5.2L4.8 17a2.4 2.4 0 0 0 2.1 3.5h10.2A2.4 2.4 0 0 0 19.2 17L16 9.7V4.5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M6.6 14.5h10.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </>
    ),
  },
];

// Desacelera no fim, para a contagem "assentar" em vez de cortar seco
function suavizar(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export function CartaoNumeros() {
  const caixaRef = useRef<HTMLDivElement>(null);
  // Começa CHEIO de propósito: assim o HTML do servidor já sai com os
  // números certos. Se o JavaScript não rodar, ninguém vê "0 anos de
  // tradição". A contagem zera e recomeça só quando vai mesmo animar.
  const [progresso, setProgresso] = useState(1);

  useEffect(() => {
    const caixa = caixaRef.current;
    if (!caixa) return;

    // Quem pediu menos animação fica com o número final, sem contagem
    const menosMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (menosMovimento) return;

    setProgresso(0);

    let quadro = 0;
    let comeco = 0;

    function animar(agora: number) {
      if (!comeco) comeco = agora;
      const t = Math.min(1, (agora - comeco) / DURACAO);
      setProgresso(suavizar(t));
      if (t < 1) quadro = requestAnimationFrame(animar);
    }

    const observador = new IntersectionObserver(
      (entradas) => {
        if (entradas[0].isIntersecting) {
          observador.disconnect(); // conta uma vez só
          quadro = requestAnimationFrame(animar);
        }
      },
      { threshold: 0.35 }
    );
    observador.observe(caixa);

    return () => {
      observador.disconnect();
      cancelAnimationFrame(quadro);
    };
  }, []);

  return (
    <div
      ref={caixaRef}
      className="relative rounded-[2rem] p-8 md:p-10 text-white overflow-hidden bg-noite ring-1 ring-white/10"
    >
      {/* Brilho de fundo, que "acende" junto com a contagem */}
      <div
        aria-hidden="true"
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          opacity: 0.35 + progresso * 0.65,
          background:
            "radial-gradient(120% 80% at 15% 0%, rgba(47,124,196,0.55), transparent 60%), radial-gradient(90% 70% at 100% 100%, rgba(224,33,41,0.28), transparent 60%)",
        }}
      />

      <div className="relative grid grid-cols-2">
        {NUMEROS.map((n, i) => {
          // Cada número começa um pouco depois do anterior
          const atraso = i * 0.12;
          const parcial = Math.max(0, Math.min(1, (progresso - atraso) / (1 - atraso)));
          const valor = (n.alvo * parcial).toLocaleString("pt-BR", {
            minimumFractionDigits: n.decimais,
            maximumFractionDigits: n.decimais,
          });

          const conteudo = (
            <>
              <span className="w-9 h-9 rounded-xl bg-white/[0.08] text-white/70 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  {n.icone}
                </svg>
              </span>
              <p
                className="font-display text-[2.6rem] md:text-5xl font-semibold leading-none tabular-nums mt-4 bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(115deg, #ffffff 30%, #b7d3ef 80%)",
                }}
              >
                {valor}
                {n.sufixo}
              </p>
              <p className="text-white/55 text-sm leading-snug mt-2">
                {n.rotulo}
                {n.link && (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                    className="inline-block ml-1.5 -mt-0.5 opacity-60"
                  >
                    <path d="M7 17 17 7m0 0H8m9 0v9" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </p>
            </>
          );

          const classeCelula = `block px-1 py-5 transition-all duration-700 ${
            i % 2 === 0 ? "pr-5 border-r border-white/10" : "pl-5"
          } ${i < 2 ? "pb-7 border-b border-white/10" : "pt-7"}`;
          const estilo = {
            opacity: 0.25 + parcial * 0.75,
            transform: `translateY(${(1 - parcial) * 10}px)`,
          };

          // A célula da nota leva ao perfil do Google
          return n.link ? (
            <a
              key={n.rotulo}
              href={n.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`${classeCelula} hover:bg-white/[0.04] rounded-xl`}
              style={estilo}
            >
              {conteudo}
            </a>
          ) : (
            <div key={n.rotulo} className={classeCelula} style={estilo}>
              {conteudo}
            </div>
          );
        })}
      </div>
    </div>
  );
}
