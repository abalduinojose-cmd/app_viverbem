// Hero da home: à esquerda a promessa e as saídas, à direita um
// painel com o produto de destaque e duas miniaturas da linha.
// Se public/hero.mp4 existir, o vídeo assume o fundo inteiro.
import Link from "next/link";
import { asset } from "@/lib/asset";
import {
  AVALIACOES_GOOGLE_NOTA,
  AVALIACOES_GOOGLE_TOTAL,
  PERFIL_GOOGLE_URL,
} from "@/lib/tipos";

// Fotos reais da linha própria usadas na composição do hero
const FOTOS_HERO = [
  { src: "/uploads/citorepair.png" },
  { src: "/uploads/glow-cream.png" },
  { src: "/uploads/omega3.png" },
];

export function HeroHome({ temVideo }: { temVideo: boolean }) {
  return (
    <section className="relative min-h-[85vh] md:min-h-[92vh] flex items-center overflow-hidden bg-white">
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

      <div className="relative max-w-7xl mx-auto px-5 md:px-8 w-full pt-24 pb-14 md:pt-28 md:pb-20 grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
        {/* Texto */}
        <div className="md:col-span-7">
          {/* Selo com a nota do Google, já entregando a prova social */}
          <a
            href={PERFIL_GOOGLE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center min-h-10 gap-2 bg-white border border-linha rounded-full pl-3 pr-4 py-2 sombra-card hover:border-royal/30 transition-colors"
          >
            <span className="flex items-center gap-0.5 text-[#f5a623]" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((e) => (
                <svg key={e} width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L12 3.5Z" />
                </svg>
              ))}
            </span>
            <span className="text-xs md:text-sm font-medium text-grafite-medio">
              {AVALIACOES_GOOGLE_NOTA.toLocaleString("pt-BR", {
                minimumFractionDigits: 1,
              })}{" "}
              no Google
              <span className="hidden sm:inline text-grafite-claro">
                {" "}
                · {AVALIACOES_GOOGLE_TOTAL} avaliações
              </span>
            </span>
          </a>

          <h1 className="font-display text-[2.15rem] sm:text-[2.7rem] md:text-[4.3rem] font-semibold text-grafite leading-[1.05] md:leading-[1.03] mt-5 md:mt-6">
            Saúde feita
            <br />
            <span>sob medida</span>
            <br />
            <span className="italic text-royal">para você</span>
          </h1>

          <p className="text-grafite-medio text-base md:text-xl leading-relaxed mt-4 md:mt-7 max-w-md">
            Fórmulas manipuladas, homeopatia e cuidado de verdade. Escolha seus
            produtos e finalize o pedido direto no nosso WhatsApp.
          </p>

          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 md:gap-4 mt-7 md:mt-9">
            <Link
              href="/produtos"
              className="degrade-marca animar-respirar inline-flex items-center justify-center gap-3 text-white text-base md:text-xl font-semibold rounded-2xl px-7 py-4 md:px-10 md:py-5 active:scale-[0.98] transition-transform"
            >
              Explorar catálogo
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link
              href="/sobre#como-pedir"
              className="inline-flex items-center justify-center gap-2 bg-white/90 backdrop-blur text-grafite border border-linha hover:border-royal/30 hover:text-royal text-sm md:text-base font-medium rounded-2xl px-6 py-3.5 md:px-7 md:py-4 transition-all active:scale-[0.98]"
            >
              Como funciona a manipulação
            </Link>
          </div>
        </div>

        {/* Produto em destaque (some quando há vídeo).
            Eram três cartões inclinados sobre um círculo, com um selo
            girado por cima: muita coisa disputando atenção com o
            título. Virou um painel só, com a foto grande e as outras
            duas em miniatura embaixo. */}
        {!temVideo && (
          <div className="hidden md:block md:col-span-5" aria-hidden="true">
            <div className="relative bg-royal-claro/60 rounded-[2.5rem] p-8 lg:p-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset(FOTOS_HERO[0].src)}
                alt=""
                decoding="async"
                width={420}
                height={420}
                className="w-full h-[19rem] lg:h-[22rem] object-contain drop-shadow-[0_20px_40px_rgba(16,42,74,0.18)]"
              />

              {/* As outras duas, pequenas, como amostra da linha */}
              <div className="flex justify-center gap-3 mt-6">
                {FOTOS_HERO.slice(1).map((f) => (
                  <div
                    key={f.src}
                    className="w-24 h-24 bg-white rounded-2xl border border-linha p-2.5 flex items-center justify-center"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={asset(f.src)}
                      alt=""
                      decoding="async"
                      width={160}
                      height={160}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                ))}
              </div>

              {/* Selo reto, encostado na borda do painel */}
              <div className="absolute -left-4 top-10 bg-white rounded-2xl border border-linha sombra-card px-4 py-3">
                <p className="font-display text-xl font-semibold text-royal leading-none">100%</p>
                <p className="text-[0.65rem] font-semibold tracking-[0.14em] uppercase text-grafite-claro mt-1">
                  sob medida
                </p>
              </div>
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
