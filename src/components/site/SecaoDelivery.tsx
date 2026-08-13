// Fechamento da home: as duas formas de receber o pedido, iguais às
// que aparecem no carrinho — entrega em casa ou retirada em uma das
// 3 lojas, cada uma com link para o mapa.
import Link from "next/link";
import {
  UNIDADES,
  WHATSAPP_NUMERO,
  WHATSAPP_LOJA,
  linkMapaUnidade,
} from "@/lib/tipos";

const PASSOS = [
  { n: "1", t: "Monte o pedido", d: "Escolha os produtos e adicione ao carrinho." },
  { n: "2", t: "Escolha como receber", d: "Entrega em casa ou retirada na loja." },
  { n: "3", t: "Finalize no WhatsApp", d: "A equipe confirma o pagamento e o prazo." },
];

export function SecaoDelivery() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 pt-20">
      <div className="bg-noite text-white rounded-[2rem] px-6 md:px-12 py-12 md:py-16">
        {/* Cabeçalho */}
        <div className="max-w-2xl">
          <p className="selo-secao text-white/60">até a sua porta</p>
          <h2 className="font-display text-3xl md:text-[2.6rem] font-semibold leading-[1.1] mt-2">
            Receba em casa ou
            <br />
            <span className="italic">retire na loja</span>
          </h2>
          <p className="text-white/65 text-lg leading-relaxed mt-4">
            Monte o pedido pelo site e finalize no WhatsApp. Você escolhe se prefere
            receber em casa ou passar em uma das nossas 3 unidades.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-10">
          {/* Entrega */}
          <div className="bg-white/[0.05] border border-white/10 rounded-[1.5rem] p-7 flex flex-col">
            <div className="flex items-center gap-3">
              <span className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M3 7.5h9v8H3zM12 10h4l3 3v2.5h-7z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                  <circle cx="7" cy="17.5" r="1.8" stroke="currentColor" strokeWidth="1.7" />
                  <circle cx="16.5" cy="17.5" r="1.8" stroke="currentColor" strokeWidth="1.7" />
                </svg>
              </span>
              <h3 className="font-display text-xl font-semibold">Entrega em casa</h3>
            </div>
            <p className="text-white/60 leading-relaxed mt-4">
              Informe o endereço na hora de fechar o pedido. A nossa equipe combina a
              taxa e o prazo da entrega com você pelo WhatsApp, antes de sair da loja.
            </p>

            <ul className="flex flex-col gap-2.5 mt-6">
              {PASSOS.map((p) => (
                <li key={p.n} className="flex items-start gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-lg bg-white/10 text-white/80 flex items-center justify-center text-xs font-bold mt-0.5">
                    {p.n}
                  </span>
                  <span>
                    <span className="block font-medium text-white/90">{p.t}</span>
                    <span className="block text-white/50 text-sm">{p.d}</span>
                  </span>
                </li>
              ))}
            </ul>

            <a
              href={`https://wa.me/${WHATSAPP_NUMERO}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1eb857] text-white font-semibold rounded-2xl px-7 py-4 transition-colors active:scale-[0.98]"
            >
              <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm5.5 14.2c-.2.7-1.3 1.3-1.9 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.2-.3.5-.4.7-.4h.5c.2 0 .4 0 .6.4l.9 2.1c.1.2.1.4 0 .6l-.4.6-.5.5c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1.1 2.1 1.4 2.5 1.6.3.1.5.1.6-.1l.8-1c.2-.3.4-.2.7-.1l2.1 1c.3.1.5.2.6.4 0-.1 0 .6-.2 1.3Z" />
              </svg>
              Falar no {WHATSAPP_LOJA}
            </a>
          </div>

          {/* Retirada */}
          <div className="bg-white/[0.05] border border-white/10 rounded-[1.5rem] p-7 flex flex-col">
            <div className="flex items-center gap-3">
              <span className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M4 9.5 5.4 5A1.5 1.5 0 0 1 6.8 4h10.4a1.5 1.5 0 0 1 1.4 1L20 9.5M4 9.5h16M4 9.5v9A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5v-9M9.5 13h5"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <h3 className="font-display text-xl font-semibold">Retirada na loja</h3>
            </div>
            <p className="text-white/60 leading-relaxed mt-4">
              Sem taxa e no seu tempo. Escolha a unidade ao fechar o pedido e a gente
              avisa assim que estiver pronto para retirar.
            </p>

            <ul className="flex flex-col gap-2 mt-6 flex-1">
              {UNIDADES.map((u) => (
                <li key={u.bairro}>
                  <a
                    href={linkMapaUnidade(u.bairro, u.endereco)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-3 rounded-2xl border border-white/10 hover:border-white/25 hover:bg-white/[0.04] px-4 py-3 transition-colors"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                      className="shrink-0 text-white/40 group-hover:text-white/70 mt-0.5 transition-colors"
                    >
                      <path d="M12 21s-6.5-5.1-6.5-10a6.5 6.5 0 1 1 13 0c0 4.9-6.5 10-6.5 10Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                      <circle cx="12" cy="11" r="2.3" stroke="currentColor" strokeWidth="1.7" />
                    </svg>
                    <span className="min-w-0">
                      <span className="block font-semibold text-white/90">{u.bairro}</span>
                      <span className="block text-white/50 text-sm leading-snug">
                        {u.endereco}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <Link
              href="/produtos"
              className="mt-7 inline-flex items-center justify-center gap-3 bg-white text-noite font-semibold rounded-2xl px-7 py-4 active:scale-[0.98] transition-transform"
            >
              Montar meu pedido
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
