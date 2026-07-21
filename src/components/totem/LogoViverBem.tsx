"use client";
// Logo da marca.
// 1º tenta usar o arquivo oficial em /public/logo.png (basta salvar o
//    logo com esse nome na pasta public/ que ele aparece em todo o app).
// 2º se o arquivo não existir, mostra a versão recriada em HTML/CSS
//    (script azul "Viver Bem" + subtítulo + onda vermelha).
// tamanho: "grande" (telas de destaque) ou "medio" (cabeçalhos)

import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/asset";

export function LogoViverBem({ tamanho = "grande" }: { tamanho?: "grande" | "medio" }) {
  const grande = tamanho === "grande";
  const [temArquivo, setTemArquivo] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);

  // Se o /logo.png não existir, o 404 pode acontecer ANTES do React
  // hidratar (perdendo o onError). Checamos no mount se a imagem
  // realmente carregou; senão, caímos para a versão em CSS.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setTemArquivo(false);
  }, []);

  if (temArquivo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        ref={imgRef}
        src={asset("/logo.png")}
        alt="Manipulação Viver Bem"
        draggable={false}
        onError={() => setTemArquivo(false)}
        className={`select-none object-contain ${grande ? "w-72 md:w-96" : "h-12"}`}
      />
    );
  }

  // Recriação fiel do logo oficial: script azul "Viver Bem",
  // subtítulo serifado "MANIPULAÇÃO E HOMEOPATIA" e a onda vermelha.
  return (
    <div className="flex flex-col items-center select-none">
      <span
        className={`fonte-logo text-royal leading-none ${
          grande ? "text-6xl md:text-7xl" : "text-[1.7rem]"
        }`}
      >
        Viver Bem
      </span>
      <span
        className={`fonte-serif tracking-[0.12em] text-grafite uppercase ${
          grande ? "text-sm md:text-base mt-2" : "text-[0.5rem] mt-0.5"
        }`}
      >
        Manipulação e Homeopatia
      </span>
      <svg
        viewBox="0 0 400 20"
        className={grande ? "w-60 md:w-72 -mt-0.5" : "w-28"}
        aria-hidden="true"
      >
        <path
          d="M4 13 C 90 1, 160 19, 240 10 S 380 3, 396 8"
          fill="none"
          stroke="#E02129"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
