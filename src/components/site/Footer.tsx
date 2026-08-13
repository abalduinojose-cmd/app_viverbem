// Rodapé do site: claro, clean e organizado em colunas, com uma
// chamada de WhatsApp em destaque no topo e a linha legal discreta.
import Link from "next/link";
import { asset } from "@/lib/asset";
import { ANOS_TRADICAO, WHATSAPP_LOJA } from "@/lib/tipos";

const UNIDADES = [
  { bairro: "Centro", endereco: "Rua Dom Pedro Segundo, 31, Loja 37" },
  { bairro: "Corrêas", endereco: "Rua Dr. Agostinho Goulão, 22" },
  { bairro: "Posse", endereco: "Estrada União e Indústria, 33.383" },
];

const NAVEGACAO = [
  { href: "/", rotulo: "Início" },
  { href: "/produtos", rotulo: "Produtos" },
  { href: "/sobre", rotulo: "Sobre" },
  { href: "/contato", rotulo: "Contatos" },
];

export function Footer() {
  return (
    <footer className="mt-auto bg-white border-t border-linha">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Chamada de atendimento */}
        <div className="py-10 md:py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-linha">
          <div>
            <p className="palavra-script text-2xl text-escarlate">fale com a gente</p>
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-grafite mt-1">
              Pronto para montar o seu pedido?
            </h2>
          </div>
          <a
            href="https://wa.me/5524988733934"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#1eb857] text-white text-lg font-semibold rounded-2xl px-7 py-4 transition-colors active:scale-[0.98]"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm5.5 14.2c-.2.7-1.3 1.3-1.9 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.2-.3.5-.4.7-.4h.5c.2 0 .4 0 .6.4l.9 2.1c.1.2.1.4 0 .6l-.4.6-.5.5c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1.1 2.1 1.4 2.5 1.6.3.1.5.1.6-.1l.8-1c.2-.3.4-.2.7-.1l2.1 1c.3.1.5.2.6.4 0-.1 0 .6-.2 1.3Z" />
            </svg>
            {WHATSAPP_LOJA}
          </a>
        </div>

        {/* Colunas */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-12 gap-8 md:gap-10">
          {/* Marca */}
          <div className="col-span-2 md:col-span-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset("/logo.png")}
              alt="Manipulação Viver Bem"
              draggable={false}
              className="h-12 w-auto object-contain"
            />
            <p className="text-grafite-medio leading-relaxed mt-4 max-w-xs">
              Há {ANOS_TRADICAO} anos cuidando de você em Petrópolis, com fórmulas
              personalizadas, homeopatia e atendimento de gente que conhece você
              pelo nome.
            </p>
            <div className="flex items-center gap-2.5 mt-5">
              <a
                href="https://wa.me/5524988733934"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-10 h-10 rounded-xl border border-linha text-grafite-medio hover:text-royal hover:border-royal/40 flex items-center justify-center transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm5.5 14.2c-.2.7-1.3 1.3-1.9 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.2-.3.5-.4.7-.4h.5c.2 0 .4 0 .6.4l.9 2.1c.1.2.1.4 0 .6l-.4.6-.5.5c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1.1 2.1 1.4 2.5 1.6.3.1.5.1.6-.1l.8-1c.2-.3.4-.2.7-.1l2.1 1c.3.1.5.2.6.4 0-.1 0 .6-.2 1.3Z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-xl border border-linha text-grafite-medio hover:text-royal hover:border-royal/40 flex items-center justify-center transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navegação */}
          <div className="md:col-span-2 md:col-start-6">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-grafite-claro mb-4">
              Navegação
            </p>
            <ul className="flex flex-col gap-2.5">
              {NAVEGACAO.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-grafite-medio hover:text-royal transition-colors"
                  >
                    {l.rotulo}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Unidades */}
          <div className="md:col-span-3">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-grafite-claro mb-4">
              Unidades
            </p>
            <ul className="flex flex-col gap-3.5">
              {UNIDADES.map((u) => (
                <li key={u.bairro}>
                  <p className="font-semibold text-grafite">{u.bairro}</p>
                  <p className="text-grafite-medio text-sm leading-snug">{u.endereco}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Como funciona */}
          <div className="md:col-span-3">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-grafite-claro mb-4">
              Como funciona
            </p>
            <p className="text-grafite-medio leading-relaxed">
              Monte seu pedido pelo site e finalize no WhatsApp. A nossa equipe recebe a
              lista pronta e combina o pagamento e a entrega ou retirada com você.
            </p>
            <Link
              href="/sobre"
              className="mt-4 inline-flex items-center gap-2 text-royal font-semibold hover:gap-3 transition-all"
            >
              Saiba mais
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Linha final */}
        <div className="border-t border-linha py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <p className="text-grafite-claro text-xs leading-relaxed max-w-xl">
            Os dados informados na finalização do pedido (nome e WhatsApp) são usados
            apenas pela Viver Bem para atendimento e ofertas, conforme a LGPD.
          </p>
          <p className="text-grafite-claro text-xs whitespace-nowrap">
            © {new Date().getFullYear()} Manipulação Viver Bem · Site por FluxoIA Studio
          </p>
        </div>
      </div>
    </footer>
  );
}
