// Hero da home — tela de impacto com o vídeo da farmácia.
// Se public/hero.mp4 existir, roda em loop, sem som, atrás do conteúdo;
// sem o vídeo, o fundo usa o halo suave da marca. O texto é o mesmo
// nos dois casos, então dá para trocar o vídeo a qualquer momento.
import Link from "next/link";
import { asset } from "@/lib/asset";
import { ANOS_TRADICAO } from "@/lib/tipos";

export function HeroHome({ temVideo }: { temVideo: boolean }) {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden">
      {/* Fundo: vídeo ou halo da marca */}
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
          {/* Véu para o texto ler bem sobre o vídeo */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-white/30 md:to-white/10" aria-hidden="true" />
        </>
      ) : (
        <div className="absolute inset-0 halo-marca bg-white" aria-hidden="true" />
      )}

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 w-full pt-24 pb-16">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 bg-white/90 backdrop-blur border border-linha rounded-full px-5 py-2 sombra-card">
            <span className="w-2 h-2 rounded-full bg-escarlate" aria-hidden="true" />
            <span className="text-sm font-medium text-grafite-medio">
              Há <b className="text-grafite">{ANOS_TRADICAO} anos</b> em Petrópolis
            </span>
          </span>

          <h1 className="text-[2.6rem] md:text-[4.2rem] font-bold text-grafite tracking-tight leading-[1.04] mt-7">
            Saúde feita
            <br />
            sob medida
            <br />
            <span className="texto-degrade">para você</span>
          </h1>

          <p className="text-grafite-medio text-lg md:text-xl leading-relaxed mt-6 max-w-md">
            Fórmulas manipuladas, homeopatia e cuidado de verdade. Escolha seus
            produtos e finalize o pedido direto no nosso WhatsApp.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-9">
            <Link
              href="/catalogo"
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
      </div>

      {/* Indicador de rolagem */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-grafite-claro animate-bounce" aria-hidden="true">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  );
}
