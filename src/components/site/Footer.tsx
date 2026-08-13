// Rodapé premium do site: a onda da marca faz a transição para o
// azul profundo, com navegação, unidades, contato, a nota de
// privacidade (LGPD) e o crédito da FluxoIA Studio.
import Link from "next/link";
import { asset } from "@/lib/asset";
import { ANOS_TRADICAO, WHATSAPP_LOJA } from "@/lib/tipos";
import { Onda } from "./Onda";

const UNIDADES = [
  { bairro: "Centro", endereco: "Rua Dom Pedro Segundo, 31, Loja 37" },
  { bairro: "Corrêas", endereco: "Rua Dr. Agostinho Goulão, 22" },
  { bairro: "Posse", endereco: "Estrada União e Indústria, 33.383" },
];

export function Footer() {
  return (
    <footer className="mt-auto">
      <Onda cor="#10173f" className="-mb-px" />
      <div className="bg-[#10173f] text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Marca */}
          <div className="md:col-span-4">
            <div className="bg-white rounded-2xl px-5 py-3 inline-flex">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset("/logo.png")}
                alt="Manipulação Viver Bem"
                draggable={false}
                className="h-12 w-auto object-contain"
              />
            </div>
            <p className="text-white/70 leading-relaxed mt-5 max-w-xs">
              Há {ANOS_TRADICAO} anos cuidando de você em Petrópolis, com fórmulas
              personalizadas, homeopatia e a crença de que bem-estar é se sentir bem
              na sua própria pele.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a
                href="https://wa.me/5524988733934"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-11 h-11 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm5.5 14.2c-.2.7-1.3 1.3-1.9 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.2-.3.5-.4.7-.4h.5c.2 0 .4 0 .6.4l.9 2.1c.1.2.1.4 0 .6l-.4.6-.5.5c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1.1 2.1 1.4 2.5 1.6.3.1.5.1.6-.1l.8-1c.2-.3.4-.2.7-.1l2.1 1c.3.1.5.2.6.4 0-.1 0 .6-.2 1.3Z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-11 h-11 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navegação */}
          <div className="md:col-span-2">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-white/50 mb-4">
              Navegação
            </p>
            <ul className="flex flex-col gap-2.5">
              <li><Link href="/" className="text-white/80 hover:text-white transition-colors">Início</Link></li>
              <li><Link href="/catalogo" className="text-white/80 hover:text-white transition-colors">Catálogo</Link></li>
              <li><Link href="/sobre" className="text-white/80 hover:text-white transition-colors">Sobre</Link></li>
              <li><Link href="/contato" className="text-white/80 hover:text-white transition-colors">Contatos</Link></li>
            </ul>
          </div>

          {/* Unidades */}
          <div className="md:col-span-3">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-white/50 mb-4">
              Unidades em Petrópolis
            </p>
            <ul className="flex flex-col gap-3">
              {UNIDADES.map((u) => (
                <li key={u.bairro}>
                  <p className="font-semibold text-white/90">{u.bairro}</p>
                  <p className="text-white/60 text-sm">{u.endereco}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div className="md:col-span-3">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-white/50 mb-4">
              Atendimento
            </p>
            <a
              href="https://wa.me/5524988733934"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-white/10 hover:bg-white/20 rounded-2xl px-4 py-3 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366" aria-hidden="true">
                <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm5.5 14.2c-.2.7-1.3 1.3-1.9 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.2-.3.5-.4.7-.4h.5c.2 0 .4 0 .6.4l.9 2.1c.1.2.1.4 0 .6l-.4.6-.5.5c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1.1 2.1 1.4 2.5 1.6.3.1.5.1.6-.1l.8-1c.2-.3.4-.2.7-.1l2.1 1c.3.1.5.2.6.4 0-.1 0 .6-.2 1.3Z" />
              </svg>
              <span className="font-semibold">{WHATSAPP_LOJA}</span>
            </a>
            <p className="text-white/55 text-sm leading-relaxed mt-4">
              Monte seu pedido pelo site e finalize direto no WhatsApp com a nossa equipe.
            </p>
          </div>
        </div>

        {/* Linha final */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <p className="text-white/45 text-xs leading-relaxed max-w-xl">
            Privacidade: os dados informados na finalização do pedido (nome e WhatsApp) são
            usados apenas pela Viver Bem para atendimento e ofertas, conforme a LGPD.
          </p>
          <p className="text-white/45 text-xs whitespace-nowrap">
            © {new Date().getFullYear()} Manipulação Viver Bem · Site por FluxoIA Studio
          </p>
        </div>
      </div>
      </div>
    </footer>
  );
}
