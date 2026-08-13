// LOJAS — as 3 unidades da Viver Bem em Petrópolis, com endereço,
// telefone, horário e o caminho no mapa. É o destino do item "Lojas"
// do menu.
import Link from "next/link";
import type { Metadata } from "next";
import {
  UNIDADES,
  linkMapaUnidade,
  WHATSAPP_LOJA,
  WHATSAPP_NUMERO,
} from "@/lib/tipos";

export const metadata: Metadata = {
  title: "Lojas · Manipulação Viver Bem",
  description:
    "As 3 unidades da Viver Bem em Petrópolis: Centro, Corrêas e Posse. Endereços, horários e como chegar.",
};

const HORARIOS = [
  { dias: "Segunda a sexta", horas: "9h às 19h" },
  { dias: "Sábado", horas: "9h às 13h" },
  { dias: "Domingo", horas: "Fechado" },
];

export default function PaginaLojas() {
  return (
    <main className="flex-1 pt-16 md:pt-[4.5rem]">
      {/* Cabeçalho da página */}
      <section className="halo-marca px-4 md:px-8 pt-14 pb-10">
        <div className="text-center max-w-2xl mx-auto">
          <p className="selo-secao text-escarlate">onde nos encontrar</p>
          <h1 className="font-display text-4xl md:text-6xl font-semibold text-grafite mt-3 tracking-tight leading-[1.05]">
            {UNIDADES.length} lojas em
            <br />
            <span className="italic text-royal">Petrópolis</span>
          </h1>
          <p className="text-grafite-medio text-lg md:text-xl mt-5 leading-relaxed">
            Retire o seu pedido sem taxa em qualquer unidade, ou receba em casa de
            moto. Todas atendem pelo mesmo WhatsApp.
          </p>
        </div>
      </section>

      {/* As unidades */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {UNIDADES.map((u, i) => (
            <div
              key={u.bairro}
              className="bg-white border border-linha rounded-[1.75rem] sombra-card hover:sombra-card-hover transition-shadow p-7 flex flex-col"
            >
              <span className="selo-secao text-grafite-claro">
                unidade {String(i + 1).padStart(2, "0")}
              </span>
              <h2 className="font-display text-2xl font-semibold text-grafite mt-2">
                {u.bairro}
              </h2>
              <p className="text-grafite-medio leading-relaxed mt-2">{u.endereco}</p>
              {u.telefone && (
                <p className="text-grafite-claro text-sm mt-1.5">
                  Telefone: {u.telefone}
                </p>
              )}

              <div className="flex flex-col gap-2 mt-6 pt-5 border-t border-linha flex-1 justify-end">
                <a
                  href={linkMapaUnidade(u.bairro, u.endereco)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 bg-royal hover:bg-royal-escuro text-white font-semibold rounded-2xl px-5 py-3.5 transition-colors active:scale-[0.98]"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M12 21s-6.5-5.1-6.5-10a6.5 6.5 0 1 1 13 0c0 4.9-6.5 10-6.5 10Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                    <circle cx="12" cy="11" r="2.3" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                  Como chegar
                </a>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMERO}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 border border-linha hover:border-royal/40 text-grafite hover:text-royal font-semibold rounded-2xl px-5 py-3.5 transition-colors active:scale-[0.98]"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="text-[#25D366]">
                    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm5.5 14.2c-.2.7-1.3 1.3-1.9 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.2-.3.5-.4.7-.4h.5c.2 0 .4 0 .6.4l.9 2.1c.1.2.1.4 0 .6l-.4.6-.5.5c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1.1 2.1 1.4 2.5 1.6.3.1.5.1.6-.1l.8-1c.2-.3.4-.2.7-.1l2.1 1c.3.1.5.2.6.4 0-.1 0 .6-.2 1.3Z" />
                  </svg>
                  {WHATSAPP_LOJA}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Horário (vale para as 3) */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 pb-20">
        <div className="bg-noite text-white rounded-[1.75rem] px-7 md:px-10 py-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <p className="selo-secao text-white/50">horário de atendimento</p>
            <h2 className="font-display text-2xl md:text-3xl font-semibold mt-1.5">
              O mesmo nas {UNIDADES.length} unidades
            </h2>
            <p className="text-white/55 mt-2 leading-relaxed">
              Prefere pedir sem sair de casa? Monte o pedido pelo site e finalize no
              WhatsApp.
            </p>
            <Link
              href="/produtos"
              className="mt-5 inline-flex items-center gap-2 bg-white text-noite font-semibold rounded-2xl px-6 py-3.5 active:scale-[0.98] transition-transform"
            >
              Ver produtos
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
          <ul className="flex flex-col divide-y divide-white/10 bg-white/[0.04] border border-white/10 rounded-2xl px-5">
            {HORARIOS.map((h) => (
              <li key={h.dias} className="flex items-baseline justify-between gap-4 py-3.5 text-sm">
                <span className="text-white/60">{h.dias}</span>
                <span className="text-white/90 font-semibold tabular-nums">{h.horas}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
