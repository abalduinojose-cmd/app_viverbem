// SOBRE — página institucional do site: a história da Viver Bem,
// como fazer o pedido, as avaliações do Google e as 3 unidades.
import Link from "next/link";
import type { Metadata } from "next";
import { obterAvaliacoes } from "@/lib/catalogo";
import { CarrosselAvaliacoes } from "@/components/totem/CarrosselAvaliacoes";
import { ANOS_TRADICAO, WHATSAPP_LOJA } from "@/lib/tipos";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sobre · Manipulação Viver Bem",
  description:
    "Há 19 anos em Petrópolis: manipulação, homeopatia e saúde personalizada. Conheça a Viver Bem, como fazer seu pedido e as nossas 3 unidades.",
};

// Passo a passo do pedido pelo site
const PASSOS = [
  {
    titulo: "Escolha seus produtos",
    texto: "Navegue pelo catálogo e adicione ao carrinho tudo o que você precisa.",
  },
  {
    titulo: "Informe seus dados",
    texto:
      "Preencha o formulário rápido com seus dados para que possamos identificar seu pedido.",
  },
  {
    titulo: "Envie para o WhatsApp",
    texto: "Finalize no site e envie seu pedido direto para a nossa equipe pelo WhatsApp.",
  },
  {
    titulo: "Finalização com a equipe",
    texto:
      "Nossa atendente recebe seu pedido na hora, verifica a disponibilidade, organiza a manipulação ou separa o item do estoque e conclui o pagamento com você.",
  },
];

// Unidades da manipulação Viver Bem em Petrópolis
const UNIDADES = [
  { bairro: "Centro", endereco: "Rua Dom Pedro Segundo, 31, Loja 37" },
  { bairro: "Corrêas", endereco: "Rua Dr. Agostinho Goulão, 22" },
  { bairro: "Posse", endereco: "Estrada União e Indústria, 33.383" },
];

export default async function PaginaSobre() {
  const avaliacoes = await obterAvaliacoes();
  const media =
    avaliacoes.length > 0
      ? avaliacoes.reduce((s, a) => s + a.nota, 0) / avaliacoes.length
      : 0;

  return (
    <main className="flex-1 pt-16 md:pt-[4.5rem]">
      {/* ---------- Hero ---------- */}
      <section className="halo-marca px-4 md:px-8 pt-14 pb-4">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.22em] uppercase text-royal bg-royal-claro px-4 py-2 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-escarlate" aria-hidden="true" />
            Saúde personalizada
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-grafite mt-6 tracking-tight leading-[1.05]">
            {ANOS_TRADICAO} anos cuidando
            <br />
            <span className="texto-degrade">de você em Petrópolis</span>
          </h1>
          <p className="text-grafite-medio text-lg md:text-xl mt-5 leading-relaxed max-w-2xl mx-auto">
            Mais do que duas décadas de história, somos especialistas em saúde
            personalizada e na crença de que a beleza autêntica é o reflexo de uma
            autoestima lá no alto. Bem-estar é se sentir bem na sua própria pele.
          </p>
        </div>
      </section>

      {/* ---------- Como fazer o pedido ---------- */}
      <section className="px-4 md:px-8 mt-12 max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-grafite tracking-tight text-center mb-8">
          Como fazer seu pedido por aqui
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {PASSOS.map((p, i) => (
            <div
              key={p.titulo}
              className="group bg-white rounded-[1.75rem] border border-linha sombra-card hover:sombra-card-hover transition-all p-7 relative overflow-hidden"
            >
              <span
                className="absolute -right-2 -top-6 text-[6rem] font-bold text-royal/5 select-none leading-none"
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <div className="relative flex items-start gap-5">
                <span className="shrink-0 w-12 h-12 rounded-2xl degrade-marca text-white flex items-center justify-center text-lg font-bold">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-xl font-bold text-grafite tracking-tight">{p.titulo}</h3>
                  <p className="text-grafite-medio mt-2 leading-relaxed">{p.texto}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Diferenciais ---------- */}
      <section className="px-4 md:px-8 mt-12 max-w-6xl mx-auto">
        <div className="bg-royal rounded-[2rem] text-white p-10 md:p-14 relative overflow-hidden">
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                t: "Dosagem sob medida",
                d: "Nada de dose padrão de fábrica: cada fórmula é preparada na quantidade e concentração exatas para você.",
              },
              {
                t: "Fórmula personalizada",
                d: "Combinamos ativos, excluímos o que você não pode tomar e escolhemos a forma ideal: cápsula, creme, gel ou solução.",
              },
              {
                t: "Qualidade controlada",
                d: "Matérias-primas certificadas e controle de qualidade em todas as etapas, com laudo de cada lote.",
              },
            ].map((x) => (
              <div key={x.t}>
                <h3 className="text-xl font-bold tracking-tight">{x.t}</h3>
                <p className="text-white/75 mt-2 leading-relaxed">{x.d}</p>
              </div>
            ))}
          </div>
          <div className="absolute -left-20 -top-20 w-64 h-64 rounded-full bg-white/5" aria-hidden="true" />
          <div className="absolute -right-16 -bottom-24 w-72 h-72 rounded-full bg-white/5" aria-hidden="true" />
        </div>
      </section>

      {/* ---------- Avaliações ---------- */}
      {avaliacoes.length > 0 && (
        <CarrosselAvaliacoes media={media} avaliacoes={avaliacoes} />
      )}

      {/* ---------- Unidades ---------- */}
      <section className="px-4 md:px-8 mt-16 max-w-6xl mx-auto pb-20">
        <div className="bg-white rounded-[2rem] border border-linha sombra-card p-8 md:p-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <span className="inline-block text-xs font-semibold tracking-[0.22em] uppercase text-royal bg-royal-claro px-4 py-1.5 rounded-full">
                Onde nos encontrar
              </span>
              <h2 className="text-2xl md:text-4xl font-bold text-grafite mt-4 tracking-tight">
                3 unidades em Petrópolis
              </h2>
            </div>
            <a
              href="https://wa.me/5524988733934"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-royal font-semibold hover:text-royal-escuro transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366" aria-hidden="true">
                <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm5.5 14.2c-.2.7-1.3 1.3-1.9 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.2-.3.5-.4.7-.4h.5c.2 0 .4 0 .6.4l.9 2.1c.1.2.1.4 0 .6l-.4.6-.5.5c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1.1 2.1 1.4 2.5 1.6.3.1.5.1.6-.1l.8-1c.2-.3.4-.2.7-.1l2.1 1c.3.1.5.2.6.4 0-.1 0 .6-.2 1.3Z" />
              </svg>
              {WHATSAPP_LOJA}
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {UNIDADES.map((u, i) => (
              <div
                key={u.bairro}
                className="group relative bg-royal-nevoa rounded-[1.5rem] border border-linha p-6 overflow-hidden transition-all hover:border-royal/30"
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
                    <h3 className="text-xl font-bold text-grafite tracking-tight">{u.bairro}</h3>
                  </div>
                </div>
                <p className="text-grafite-medio mt-4 leading-relaxed">{u.endereco}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/produtos"
              className="degrade-marca inline-flex items-center gap-3 text-white text-lg font-semibold rounded-2xl px-10 py-5 active:scale-[0.98] transition-all"
            >
              Explorar o catálogo
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
