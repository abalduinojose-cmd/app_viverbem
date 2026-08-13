"use client";
// Casca do painel: barra lateral clara no desktop e gaveta no celular.
//
// A lateral antiga era um bloco azul fixo de 256px, que no celular
// sobrava pouco mais de 100px para o conteúdo. Agora ela some abaixo
// de lg e vira uma gaveta, aberta por um botão na barra do topo.

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BotaoSair } from "./BotaoSair";

export interface ItemNav {
  href: string;
  rotulo: string;
  icone: keyof typeof ICONES;
  grupo: string;
  externo?: boolean;
}

export const ICONES = {
  produtos: (
    <>
      <path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5v-9Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="m3.5 7.5 8.5 4.6 8.5-4.6M12 21v-8.9" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </>
  ),
  categorias: (
    <>
      <rect x="3.5" y="4" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <rect x="13.5" y="4" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <rect x="3.5" y="13" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <rect x="13.5" y="13" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.7" />
    </>
  ),
  log: (
    <>
      <rect x="4.5" y="3" width="15" height="18" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8.5 8h7M8.5 12h7M8.5 16h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </>
  ),
  clientes: (
    <>
      <circle cx="9" cy="8.5" r="3.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3.5 19.5c.6-3 2.8-4.7 5.5-4.7s4.9 1.7 5.5 4.7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M15.5 5.6a3.5 3.5 0 0 1 0 5.8M18 15.2c1.4.8 2.3 2.2 2.6 4.3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </>
  ),
  site: (
    <>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3.5 12h17M12 3.5c2.2 2.4 3.3 5.3 3.3 8.5s-1.1 6.1-3.3 8.5c-2.2-2.4-3.3-5.3-3.3-8.5S9.8 5.9 12 3.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </>
  ),
};

export function CascaAdmin({
  itens,
  nome,
  papel,
  children,
}: {
  itens: ItemNav[];
  nome: string;
  papel: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [gaveta, setGaveta] = useState(false);

  // Trocar de página fecha a gaveta
  useEffect(() => setGaveta(false), [pathname]);

  // Com a gaveta aberta, o fundo não rola junto
  useEffect(() => {
    document.body.style.overflow = gaveta ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [gaveta]);

  const grupos = itens.reduce<Record<string, ItemNav[]>>((acc, i) => {
    (acc[i.grupo] ||= []).push(i);
    return acc;
  }, {});

  const tituloAtual =
    itens.find((i) => !i.externo && pathname.startsWith(i.href))?.rotulo ?? "Painel";

  const menu = (
    <>
      {/* Marca */}
      <div className="px-5 py-5 border-b border-linha">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt="Manipulação Viver Bem"
          className="h-9 w-auto object-contain"
          draggable={false}
        />
        <p className="text-[0.6rem] tracking-[0.22em] uppercase mt-2.5 text-grafite-claro">
          Painel do gestor
        </p>
      </div>

      <nav className="flex-1 p-3 overflow-y-auto">
        {Object.entries(grupos).map(([grupo, lista]) => (
          <div key={grupo}>
            <p className="px-3 pt-4 pb-1.5 text-[0.6rem] font-semibold tracking-[0.2em] uppercase text-grafite-claro">
              {grupo}
            </p>
            {lista.map((i) => {
              const ativo = !i.externo && pathname.startsWith(i.href);
              const classe = `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.95rem] font-medium transition-colors ${
                ativo
                  ? "bg-royal-claro text-royal"
                  : "text-grafite-medio hover:text-royal hover:bg-royal-nevoa"
              }`;
              const conteudo = (
                <>
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                    className={`shrink-0 ${ativo ? "text-royal" : "text-grafite-claro group-hover:text-royal"}`}
                  >
                    {ICONES[i.icone]}
                  </svg>
                  <span className="flex-1">{i.rotulo}</span>
                  {i.externo && (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-grafite-claro">
                      <path d="M7 17 17 7m0 0H8m9 0v9" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </>
              );

              return i.externo ? (
                <a key={i.href} href={i.href} target="_blank" rel="noopener noreferrer" className={classe}>
                  {conteudo}
                </a>
              ) : (
                <Link key={i.href} href={i.href} className={classe}>
                  {conteudo}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Quem está logado */}
      <div className="p-3 border-t border-linha">
        <div className="flex items-center gap-3 px-1 pb-3">
          <span className="w-9 h-9 rounded-full degrade-marca text-white flex items-center justify-center font-bold shrink-0">
            {nome.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-grafite truncate">{nome}</p>
            <p className="text-[0.65rem] uppercase tracking-wider text-grafite-claro">{papel}</p>
          </div>
        </div>
        <BotaoSair />
      </div>
    </>
  );

  return (
    <div className="flex-1 flex min-h-screen bg-royal-nevoa">
      {/* Lateral fixa (desktop) */}
      <aside className="hidden lg:flex w-64 shrink-0 bg-white border-r border-linha flex-col sticky top-0 h-screen">
        {menu}
      </aside>

      {/* Gaveta (celular e tablet) */}
      {gaveta && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-noite/50 backdrop-blur-sm flex"
          onClick={() => setGaveta(false)}
        >
          <div
            className="bg-white w-[17rem] max-w-[85vw] h-full flex flex-col animar-surgir shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {menu}
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Barra do topo, só fora do desktop */}
        <header className="lg:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-linha flex items-center gap-3 px-4 h-14">
          <button
            type="button"
            onClick={() => setGaveta(true)}
            aria-label="Abrir menu"
            className="w-10 h-10 -ml-2 rounded-xl text-grafite hover:bg-royal-nevoa flex items-center justify-center transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </button>
          <p className="font-semibold text-grafite truncate">{tituloAtual}</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt=""
            className="h-7 w-auto object-contain ml-auto"
            draggable={false}
          />
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-10 min-w-0">{children}</main>
      </div>
    </div>
  );
}
