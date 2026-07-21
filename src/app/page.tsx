// Tela inicial do TOTEM (modo quiosque) — layout clean, single-column,
// muito respiro, uma CTA principal e um caminho secundário discreto.
import Link from "next/link";
import { LogoViverBem } from "@/components/totem/LogoViverBem";
import { ANOS_TRADICAO, WHATSAPP_LOJA } from "@/lib/tipos";

export default function TelaInicial() {
  return (
    <div className="halo-marca flex-1 flex flex-col items-center justify-between bg-white py-12 px-6">
      {/* Selo de tradição — discreto */}
      <div className="inline-flex items-center gap-2 bg-royal-nevoa rounded-full px-5 py-2 border border-linha">
        <span className="w-2 h-2 rounded-full bg-escarlate" aria-hidden="true" />
        <p className="text-sm font-medium text-grafite-medio">
          Há <span className="text-grafite font-semibold">{ANOS_TRADICAO} anos</span> em Petrópolis
        </p>
      </div>

      {/* Logo + chamada */}
      <div className="flex flex-col items-center text-center max-w-2xl">
        <LogoViverBem tamanho="grande" />
        <h1 className="mt-12 text-4xl md:text-6xl font-bold text-grafite leading-[1.05] tracking-tight">
          Saúde feita sob medida
          <br />
          <span className="texto-degrade">para você</span>
        </h1>
        <p className="mt-5 text-lg md:text-xl text-grafite-medio max-w-lg leading-relaxed">
          Selecione seus produtos e agilize seu atendimento conosco.
        </p>

        {/* CTA principal — degradê da marca, moderna */}
        <Link
          href="/catalogo"
          className="degrade-marca animar-respirar mt-11 inline-flex items-center gap-3 text-white text-xl md:text-2xl font-semibold rounded-2xl px-12 py-6 transition-all active:scale-[0.98]"
        >
          Explorar catálogo
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M5 12h14m0 0-6-6m6 6-6 6"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>

        {/* Caminho secundário — botão leve, com halo suave e seta */}
        <Link
          href="/como-funciona"
          className="group mt-5 inline-flex items-center gap-3 bg-white/70 backdrop-blur-sm text-grafite-medio hover:text-royal border border-linha hover:border-royal/30 text-base font-medium rounded-full pl-3 pr-5 py-2.5 transition-all active:scale-[0.98] hover:shadow-[0_6px_20px_rgba(28,105,181,0.12)]"
        >
          <span className="w-8 h-8 rounded-full bg-royal-claro text-royal flex items-center justify-center group-hover:degrade-marca group-hover:text-white transition-all">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9.5 9.2a2.6 2.6 0 0 1 5 .9c0 1.7-2.5 2.2-2.5 3.9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <circle cx="12" cy="17.5" r="1.2" fill="currentColor" />
            </svg>
          </span>
          Como fazer seu pedido?
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-0.5"
          >
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>

      {/* Rodapé com contato */}
      <div className="flex items-center gap-2 text-grafite-medio">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366" aria-hidden="true">
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm5.5 14.2c-.2.7-1.3 1.3-1.9 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.2-.3.5-.4.7-.4h.5c.2 0 .4 0 .6.4l.9 2.1c.1.2.1.4 0 .6l-.4.6-.5.5c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1.1 2.1 1.4 2.5 1.6.3.1.5.1.6-.1l.8-1c.2-.3.4-.2.7-.1l2.1 1c.3.1.5.2.6.4 0-.1 0 .6-.2 1.3Z" />
        </svg>
        <span className="font-medium text-sm">{WHATSAPP_LOJA}</span>
      </div>
    </div>
  );
}
