// Rodapé do site em azul profundo, para fechar a página com peso.
// Estrutura: chamada de WhatsApp em cartão destacado, depois quatro
// colunas (marca, navegação e atendimento) e a linha legal.
import Link from "next/link";
import { asset } from "@/lib/asset";
import { HorarioAtendimento } from "./HorarioAtendimento";
import {
  ANOS_TRADICAO,
  WHATSAPP_LOJA,
  WHATSAPP_NUMERO,
  INSTAGRAM_URL,
} from "@/lib/tipos";

const LINK_WHATSAPP = `https://wa.me/${WHATSAPP_NUMERO}`;


const NAVEGACAO = [
  { href: "/", rotulo: "Início" },
  { href: "/produtos", rotulo: "Produtos" },
  { href: "/sobre", rotulo: "A Viver Bem" },
  { href: "/lojas", rotulo: "Lojas" },
  { href: "/contato", rotulo: "Contatos" },
];


function IconeWhatsApp({ tamanho = 22 }: { tamanho?: number }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm5.5 14.2c-.2.7-1.3 1.3-1.9 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.2-.3.5-.4.7-.4h.5c.2 0 .4 0 .6.4l.9 2.1c.1.2.1.4 0 .6l-.4.6-.5.5c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1.1 2.1 1.4 2.5 1.6.3.1.5.1.6-.1l.8-1c.2-.3.4-.2.7-.1l2.1 1c.3.1.5.2.6.4 0-.1 0 .6-.2 1.3Z" />
    </svg>
  );
}


// Título de coluna, no mesmo padrão nas quatro
function TituloColuna({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-white/45 mb-5">
      {children}
    </p>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto bg-noite text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Chamada de atendimento */}
        <div className="pt-14 md:pt-16">
          <div className="bg-white/[0.06] border border-white/10 rounded-[1.75rem] px-7 md:px-10 py-8 md:py-9 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="selo-secao text-white/60">fale com a gente</p>
              <h2 className="font-display text-2xl md:text-[1.75rem] font-semibold mt-0.5">
                Pronto para montar o seu pedido?
              </h2>
            </div>
            <a
              href={LINK_WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1eb857] text-white text-lg font-semibold rounded-2xl px-7 py-4 transition-colors active:scale-[0.98]"
            >
              <IconeWhatsApp />
              {WHATSAPP_LOJA}
            </a>
          </div>
        </div>

        {/* Colunas */}
        <div className="py-14 grid grid-cols-2 md:grid-cols-12 gap-x-8 gap-y-12">
          {/* Marca */}
          <div className="col-span-2 md:col-span-5">
            {/* O logo é colorido, então some no escuro: viramos ele em branco */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset("/logo.png")}
              alt="Manipulação Viver Bem"
              draggable={false}
              loading="lazy"
              decoding="async"
              width={220}
              height={97}
              className="h-11 w-auto object-contain brightness-0 invert"
            />
            <p className="text-white/60 leading-relaxed mt-5 max-w-xs">
              Há {ANOS_TRADICAO} anos cuidando de você em Petrópolis, com fórmulas
              personalizadas, homeopatia e atendimento de gente que conhece você
              pelo nome.
            </p>
            <div className="flex items-center gap-2.5 mt-6">
              <a
                href={LINK_WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-11 h-11 rounded-xl bg-white/[0.07] border border-white/10 text-white/70 hover:text-white hover:bg-white/[0.14] flex items-center justify-center transition-colors"
              >
                <IconeWhatsApp tamanho={19} />
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-11 h-11 rounded-xl bg-white/[0.07] border border-white/10 text-white/70 hover:text-white hover:bg-white/[0.14] flex items-center justify-center transition-colors"
              >
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navegação */}
          <div className="md:col-span-3">
            <TituloColuna>Navegação</TituloColuna>
            <ul className="flex flex-col -my-1.5">
              {NAVEGACAO.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="inline-flex items-center min-h-11 text-white/60 hover:text-white transition-colors"
                  >
                    {l.rotulo}
                  </Link>
                </li>
              ))}
            </ul>
          </div>


          {/* Atendimento */}
          <div className="col-span-2 md:col-span-4">
            <TituloColuna>Atendimento</TituloColuna>
            <HorarioAtendimento />
          </div>
        </div>

        {/* Linha final */}
        <div className="border-t border-white/10 py-7 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <p className="text-white/40 text-xs leading-relaxed max-w-xl">
            Os dados informados na finalização do pedido (nome e WhatsApp) são usados
            apenas pela Viver Bem para atendimento e ofertas, conforme a LGPD.
          </p>
          <p className="text-white/40 text-xs md:text-right whitespace-nowrap">
            © {new Date().getFullYear()} Manipulação Viver Bem
          </p>
        </div>
      </div>
    </footer>
  );
}
