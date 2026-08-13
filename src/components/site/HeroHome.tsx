// Hero da home — assimétrico e com a cara da Viver Bem:
// à esquerda o texto (com o script e o sublinhado ondulado da marca),
// à direita uma composição em cartões com fotos reais dos produtos.
// Se public/hero.mp4 existir, o vídeo assume o fundo inteiro.
import Link from "next/link";
import { asset } from "@/lib/asset";
import { ANOS_TRADICAO } from "@/lib/tipos";

// Fotos reais da linha própria usadas na composição do hero
const FOTOS_HERO = [
  { src: "/uploads/citorepair.png", incl: "-5deg" },
  { src: "/uploads/glow-cream.png", incl: "3deg" },
  { src: "/uploads/omega3.png", incl: "-2deg" },
];

export function HeroHome({ temVideo }: { temVideo: boolean }) {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-white">
      {/* Fundo: vídeo (quando existir) ou halo suave da marca */}
      {temVideo ? (
        <>
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src={asset("/hero.mp4")}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-white/25 md:to-white/5"
            aria-hidden="true"
          />
        </>
      ) : (
        <div className="absolute inset-0 halo-marca" aria-hidden="true" />
      )}

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 w-full pt-28 pb-20 grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
        {/* Texto */}
        <div className="md:col-span-7">
          <p className="palavra-script text-2xl md:text-3xl text-escarlate">
            há {ANOS_TRADICAO} anos em Petrópolis
          </p>

          <h1 className="font-display text-[2.7rem] md:text-[4.3rem] font-semibold text-grafite leading-[1.03] mt-4">
            Saúde feita
            <br />
            <span className="sublinhado-onda">sob medida</span>
            <br />
            <span className="italic text-royal">para você</span>
          </h1>

          <p className="text-grafite-medio text-lg md:text-xl leading-relaxed mt-7 max-w-md">
            Fórmulas manipuladas, homeopatia e cuidado de verdade. Escolha seus
            produtos e finalize o pedido direto no nosso WhatsApp.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-9">
            <Link
              href="/produtos"
              className="degrade-marca animar-respirar inline-flex items-center gap-3 text-white text-lg md:text-xl font-semibold rounded-2xl px-9 py-4.5 md:px-10 md:py-5 active:scale-[0.98] transition-transform"
            >
              Explorar catálogo
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link
              href="/sobre"
              className="inline-flex items-center gap-2 bg-white/90 backdrop-blur text-grafite border border-linha hover:border-royal/30 hover:text-royal text-base font-medium rounded-2xl px-7 py-4 transition-all active:scale-[0.98]"
            >
              Como funciona a manipulação
            </Link>
          </div>
        </div>

        {/* Composição com produtos reais (some quando há vídeo) */}
        {!temVideo && (
          <div className="hidden md:block md:col-span-5 relative h-[30rem]" aria-hidden="true">
            {/* Círculo de fundo */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-[26rem] h-[26rem] rounded-full bg-royal-claro/70" />

            {/* Fotos em composição */}
            <div
              className="absolute left-2 top-6 w-44 bg-white rounded-3xl border border-linha p-4 shadow-[0_18px_44px_rgba(16,42,74,0.14)]"
              style={{ rotate: FOTOS_HERO[0].incl }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(FOTOS_HERO[0].src)} alt="" className="w-full h-40 object-contain" />
            </div>
            <div
              className="absolute right-6 top-16 w-48 bg-white rounded-3xl border border-linha p-4 shadow-[0_18px_44px_rgba(16,42,74,0.16)]"
              style={{ rotate: FOTOS_HERO[1].incl }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(FOTOS_HERO[1].src)} alt="" className="w-full h-44 object-contain" />
            </div>
            <div
              className="absolute left-24 bottom-2 w-44 bg-white rounded-3xl border border-linha p-4 shadow-[0_18px_44px_rgba(16,42,74,0.14)]"
              style={{ rotate: FOTOS_HERO[2].incl }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(FOTOS_HERO[2].src)} alt="" className="w-full h-40 object-contain" />
            </div>

            {/* Selo 100% sob medida */}
            <div className="absolute right-0 bottom-10 bg-royal text-white rounded-2xl px-5 py-3.5 shadow-[0_14px_34px_rgba(28,105,181,0.35)] rotate-3">
              <p className="palavra-script text-xl leading-none">fórmulas</p>
              <p className="text-xs font-semibold tracking-widest uppercase mt-1">100% sob medida</p>
            </div>
          </div>
        )}
      </div>

      {/* Indicador de rolagem */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-grafite-claro animate-bounce" aria-hidden="true">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  );
}
