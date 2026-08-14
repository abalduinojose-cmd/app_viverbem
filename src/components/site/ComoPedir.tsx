// "Como fazer seu pedido" — os 4 passos reais do site.
//
// Era uma grade de 4 cartões com textos longos, que a pessoa tinha
// que ler inteiros para entender a ordem. Virou uma trilha numerada:
// no computador ela corre na horizontal, com a linha ligando os
// passos; no celular desce na vertical. Cada passo tem ícone, uma
// frase curta e, quando ajuda, um detalhe embaixo.
import Link from "next/link";
import { WHATSAPP_NUMERO, UNIDADES } from "@/lib/tipos";
import { IconeMoto } from "./IconeMoto";

const PASSOS = [
  {
    titulo: "Escolha os produtos",
    texto: "Navegue pelo catálogo e adicione ao carrinho.",
    detalhe: "Dá para escolher a dosagem em vários itens.",
    icone: (
      <>
        <path
          d="M3 4h1.8l2 10.1a1.8 1.8 0 0 0 1.8 1.6h7.1a1.8 1.8 0 0 0 1.8-1.5L19 7.2H5.4"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="9" cy="19" r="1.4" fill="currentColor" />
        <circle cx="15.5" cy="19" r="1.4" fill="currentColor" />
      </>
    ),
  },
  {
    titulo: "Diga como quer receber",
    texto: "Entrega em casa ou retirada na loja.",
    detalhe: `A entrega é de moto. A retirada é sem taxa, em ${UNIDADES.length} unidades.`,
    icone: "moto" as const,
  },
  {
    titulo: "Envie pelo WhatsApp",
    texto: "O pedido chega pronto para a nossa equipe.",
    detalhe: "Você não paga nada pelo site.",
    icone: (
      <path
        d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm5.5 14.2c-.2.7-1.3 1.3-1.9 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.2-.3.5-.4.7-.4h.5c.2 0 .4 0 .6.4l.9 2.1c.1.2.1.4 0 .6l-.4.6-.5.5c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1.1 2.1 1.4 2.5 1.6.3.1.5.1.6-.1l.8-1c.2-.3.4-.2.7-.1l2.1 1c.3.1.5.2.6.4 0-.1 0 .6-.2 1.3Z"
        fill="currentColor"
      />
    ),
  },
  {
    titulo: "A equipe confirma",
    texto: "Conferimos, preparamos e combinamos o pagamento.",
    detalhe: "Avisamos assim que estiver pronto.",
    icone: (
      <>
        <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
        <path
          d="M8.5 12.3l2.4 2.4 4.6-5"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ),
  },
];

export function ComoPedir() {
  return (
    <section id="como-pedir" className="px-4 md:px-8 mt-14 max-w-6xl mx-auto scroll-mt-24">
      <div className="text-center max-w-xl mx-auto">
        <p className="selo-secao text-escarlate">simples assim</p>
        <h2 className="font-display text-3xl md:text-[2.6rem] font-semibold text-grafite tracking-tight mt-2">
          Como fazer seu pedido
        </h2>
        <p className="text-grafite-medio text-base md:text-lg mt-3 leading-relaxed">
          São 4 passos, e leva menos de dois minutos.
        </p>
      </div>

      {/* Trilha: horizontal no computador, vertical no celular */}
      <ol className="relative mt-10 grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-5">
        {/* A linha que liga os passos, atrás dos números */}
        <span
          aria-hidden="true"
          className="hidden md:block absolute top-7 left-[12.5%] right-[12.5%] h-px bg-linha"
        />
        <span
          aria-hidden="true"
          className="md:hidden absolute top-6 bottom-6 left-7 w-px bg-linha"
        />

        {PASSOS.map((p, i) => (
          <li key={p.titulo} className="relative flex md:flex-col gap-4 md:gap-0 md:text-center">
            {/* Número e ícone */}
            <div className="shrink-0 md:mx-auto relative">
              <span className="w-14 h-14 rounded-2xl bg-white border border-linha sombra-card text-royal flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  {p.icone === "moto" ? <IconeMoto tamanho={24} /> : p.icone}
                </svg>
              </span>
              <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full degrade-marca text-white text-xs font-bold flex items-center justify-center ring-2 ring-white">
                {i + 1}
              </span>
            </div>

            <div className="md:mt-5">
              <h3 className="font-display text-lg font-semibold text-grafite leading-snug">
                {p.titulo}
              </h3>
              <p className="text-grafite-medio leading-relaxed mt-1.5">{p.texto}</p>
              <p className="text-grafite-claro text-sm leading-relaxed mt-2">{p.detalhe}</p>
            </div>
          </li>
        ))}
      </ol>

      {/* Saídas: começar o pedido ou tirar dúvida antes */}
      <div className="flex flex-col sm:flex-row sm:justify-center gap-3 mt-10">
        <Link
          href="/produtos"
          className="degrade-marca inline-flex items-center justify-center gap-3 text-white text-lg font-semibold rounded-2xl px-8 py-4 active:scale-[0.98] transition-transform"
        >
          Começar meu pedido
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <a
          href={`https://wa.me/${WHATSAPP_NUMERO}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2.5 bg-white text-grafite border border-linha hover:border-royal/40 hover:text-royal font-medium rounded-2xl px-7 py-4 transition-colors active:scale-[0.98]"
        >
          <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="text-[#25D366]">
            <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm5.5 14.2c-.2.7-1.3 1.3-1.9 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.2-.3.5-.4.7-.4h.5c.2 0 .4 0 .6.4l.9 2.1c.1.2.1.4 0 .6l-.4.6-.5.5c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1.1 2.1 1.4 2.5 1.6.3.1.5.1.6-.1l.8-1c.2-.3.4-.2.7-.1l2.1 1c.3.1.5.2.6.4 0-.1 0 .6-.2 1.3Z" />
          </svg>
          Tirar uma dúvida antes
        </a>
      </div>
    </section>
  );
}
