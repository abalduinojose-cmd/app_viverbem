// CONTATOS — página com o WhatsApp e as 3 unidades da Viver Bem.
import type { Metadata } from "next";
import { WHATSAPP_LOJA } from "@/lib/tipos";

export const metadata: Metadata = {
  title: "Contatos · Manipulação Viver Bem",
  description:
    "Fale com a Manipulação Viver Bem pelo WhatsApp e visite as nossas 3 unidades em Petrópolis: Centro, Corrêas e Posse.",
};

const UNIDADES = [
  {
    bairro: "Centro",
    endereco: "Rua Dom Pedro Segundo, 31, Loja 37",
    complemento: "Petrópolis/RJ",
  },
  {
    bairro: "Corrêas",
    endereco: "Rua Dr. Agostinho Goulão, 22",
    complemento: "Petrópolis/RJ",
  },
  {
    bairro: "Posse",
    endereco: "Estrada União e Indústria, 33.383",
    complemento: "Petrópolis/RJ",
  },
];

export default function PaginaContato() {
  return (
    <main className="flex-1 pt-16 md:pt-[4.5rem]">
      {/* Hero */}
      <section className="halo-marca px-4 md:px-8 pt-14 pb-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-block text-xs font-semibold tracking-[0.22em] uppercase text-royal bg-royal-claro px-4 py-2 rounded-full">
            Fale com a gente
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-grafite mt-6 tracking-tight leading-[1.05]">
            Estamos <span className="texto-degrade">pertinho</span>
            <br />
            de você
          </h1>
          <p className="text-grafite-medio text-lg md:text-xl mt-5 leading-relaxed">
            Atendimento pelo WhatsApp e 3 unidades em Petrópolis para você visitar.
          </p>

          <a
            href="https://wa.me/5524988733934"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#1eb857] text-white text-lg md:text-xl font-semibold rounded-2xl px-9 py-5 transition-colors active:scale-[0.98] shadow-[0_10px_30px_rgba(37,211,102,0.35)]"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm5.5 14.2c-.2.7-1.3 1.3-1.9 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.2-.3.5-.4.7-.4h.5c.2 0 .4 0 .6.4l.9 2.1c.1.2.1.4 0 .6l-.4.6-.5.5c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1.1 2.1 1.4 2.5 1.6.3.1.5.1.6-.1l.8-1c.2-.3.4-.2.7-.1l2.1 1c.3.1.5.2.6.4 0-.1 0 .6-.2 1.3Z" />
            </svg>
            {WHATSAPP_LOJA}
          </a>
        </div>
      </section>

      {/* Unidades */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 pt-10 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {UNIDADES.map((u, i) => (
            <div
              key={u.bairro}
              className="relative bg-white rounded-[1.75rem] border border-linha sombra-card p-7 overflow-hidden"
            >
              <span className="absolute top-0 left-0 right-0 h-1 degrade-marca" aria-hidden="true" />
              <div className="flex items-center gap-3">
                <span className="shrink-0 w-12 h-12 rounded-2xl degrade-marca text-white flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                    <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                </span>
                <div>
                  <p className="text-[0.65rem] font-semibold tracking-widest text-grafite-claro uppercase">
                    Unidade {i + 1}
                  </p>
                  <h2 className="text-xl font-bold text-grafite tracking-tight">{u.bairro}</h2>
                </div>
              </div>
              <p className="text-grafite-medio mt-4 leading-relaxed">{u.endereco}</p>
              <p className="text-grafite-claro text-sm">{u.complemento}</p>
              <a
                href={`https://www.google.com/maps/search/${encodeURIComponent(
                  "Manipulação Viver Bem " + u.endereco + " Petrópolis"
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center min-h-11 gap-2 text-royal font-semibold hover:gap-3 transition-all"
              >
                Ver no mapa
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
