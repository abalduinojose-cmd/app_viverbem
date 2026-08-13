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
} from "@/lib/tipos";

const DURACAO = 1400; // ms da contagem

const NUMEROS = [
  { alvo: ANOS_TRADICAO, decimais: 0, sufixo: "", rotulo: "anos de tradição" },
  { alvo: UNIDADES.length, decimais: 0, sufixo: "", rotulo: "unidades em Petrópolis" },
  {
    alvo: AVALIACOES_GOOGLE_NOTA,
    decimais: 1,
    sufixo: "",
    rotulo: `nota no Google, em ${AVALIACOES_GOOGLE_TOTAL} avaliações`,
  },
  { alvo: 100, decimais: 0, sufixo: "%", rotulo: "fórmulas sob medida" },
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
      className="relative rounded-[2rem] p-8 md:p-10 text-white overflow-hidden bg-noite"
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

          return (
            <div
              key={n.rotulo}
              className={`px-1 py-5 transition-all duration-700 ${
                i % 2 === 0 ? "pr-5 border-r border-white/10" : "pl-5"
              } ${i < 2 ? "pb-7 border-b border-white/10" : "pt-7"}`}
              style={{
                opacity: 0.25 + parcial * 0.75,
                transform: `translateY(${(1 - parcial) * 10}px)`,
              }}
            >
              <p className="font-display text-[2.7rem] md:text-5xl font-semibold leading-none tabular-nums">
                {valor}
                {n.sufixo}
              </p>
              <p className="text-white/55 text-sm leading-snug mt-2">{n.rotulo}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
