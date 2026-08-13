// HOME do site — a jornada definida com o cliente:
// Hero (vídeo) > Produtos > Banner > Produtos > Sobre > Produtos >
// Delivery > Destaques (linha própria) > Destaques (avaliações) >
// Produtos (combos) > Rodapé.
//
// Identidade: serif Fraunces nos títulos, o script do logo nas
// anotações e reveals ao rolar.
// O vídeo do hero é opcional: basta salvar public/hero.mp4.
import fs from "fs";
import path from "path";
import Link from "next/link";
import { obterCatalogo, obterAvaliacoes } from "@/lib/catalogo";
import { TIPO_COMBO, ANOS_TRADICAO, AVALIACOES_GOOGLE_NOTA } from "@/lib/tipos";
import { FaixaProdutos } from "@/components/site/FaixaProdutos";
import { HeroHome } from "@/components/site/HeroHome";
import { SecaoTitulo } from "@/components/site/SecaoTitulo";
import { MarqueeMarca } from "@/components/site/MarqueeMarca";
import { Revelar } from "@/components/site/Revelar";
import { ReelsInstagram } from "@/components/site/ReelsInstagram";
import { CarrosselAvaliacoes } from "@/components/totem/CarrosselAvaliacoes";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [{ categorias, produtos }, avaliacoes] = await Promise.all([
    obterCatalogo(),
    obterAvaliacoes(),
  ]);

  const destaques = produtos.filter((p) => p.destaque && p.tipo !== TIPO_COMBO);
  const novidades = produtos.filter((p) => p.novidade);
  const combos = produtos.filter((p) => p.tipo === TIPO_COMBO);
  const categoriaDermato = categorias.find(
    (c) => c.slug.includes("dermato") || c.slug.includes("estetica")
  );
  const dermatologicos = categoriaDermato
    ? produtos.filter((p) => p.categoriaId === categoriaDermato.id)
    : [];
  const vitaminas = categorias.find((c) => c.slug.includes("vitaminas"));
  const produtosVitaminas = vitaminas
    ? produtos.filter((p) => p.categoriaId === vitaminas.id)
    : [];

  // O vídeo do hero só entra se o arquivo existir em public/hero.mp4
  const temVideo = fs.existsSync(path.join(process.cwd(), "public", "hero.mp4"));

  return (
    <main className="flex-1">
      {/* 1 ─ HERO */}
      <HeroHome temVideo={temVideo} />

      {/* Faixa da marca em movimento */}
      <MarqueeMarca />

      {/* 2 ─ PRODUTOS: mais procurados */}
      {destaques.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-8 pt-16">
          <Revelar>
            <SecaoTitulo
              selo="os queridinhos"
              titulo="Mais procurados"
              descricao="As fórmulas que os nossos clientes mais pedem."
            />
            <FaixaProdutos produtos={destaques} />
          </Revelar>
        </section>
      )}

      {/* 3 ─ BANNER: fórmula personalizada */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pt-16">
        <Revelar>
          <div className="degrade-marca rounded-[2rem] px-8 md:px-14 py-12 md:py-16 text-white relative overflow-hidden">
            <div className="relative max-w-2xl">
              <p className="selo-secao text-white/75">
                do seu jeito
              </p>
              <h2 className="font-display text-3xl md:text-5xl font-semibold leading-[1.08] mt-2">
                Sua fórmula, na dose
                <br />
                certa <span className="italic">para você</span>
              </h2>
              <p className="text-white/85 text-lg mt-4 leading-relaxed max-w-lg">
                Nada de dose padrão de fábrica: cada manipulado é preparado sob medida,
                com acompanhamento farmacêutico de verdade.
              </p>
              <Link
                href="/produtos"
                className="mt-7 inline-flex items-center gap-3 bg-white text-royal text-lg font-semibold rounded-2xl px-8 py-4 active:scale-95 transition-transform"
              >
                Explorar o catálogo
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
            <div className="absolute -right-20 -top-24 w-80 h-80 rounded-full bg-white/10" aria-hidden="true" />
          </div>
        </Revelar>
      </section>

      {/* 4 ─ PRODUTOS: novidades */}
      {novidades.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-8 pt-16">
          <Revelar>
            <SecaoTitulo
              selo="acabou de chegar"
              titulo="Novidades"
              descricao="Lançamentos e fórmulas novas da Viver Bem."
              corSelo="escarlate"
            />
            <FaixaProdutos produtos={novidades} />
          </Revelar>
        </section>
      )}

      {/* 5 ─ SOBRE (resumo institucional) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <Revelar>
            <p className="selo-secao text-escarlate">desde 2007</p>
            <h2 className="font-display text-3xl md:text-[2.8rem] font-semibold text-grafite leading-[1.08] mt-2">
              {ANOS_TRADICAO} anos cuidando
              <br />
              <span className="italic text-royal">de você</span>
            </h2>
            <p className="text-grafite-medio text-lg leading-relaxed mt-6">
              Somos especialistas em saúde personalizada e acreditamos que a beleza
              autêntica é o reflexo de uma autoestima lá no alto. Fórmulas manipuladas,
              homeopatia e atendimento de gente que conhece você pelo nome.
            </p>
            <ul className="mt-6 flex flex-col gap-3">
              {[
                "Farmacêuticos que analisam a sua receita com atenção individual",
                "Dosagem sob medida, sem excesso e sem falta",
                "Matérias-primas certificadas e controle de qualidade em cada lote",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 text-grafite">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-royal-claro text-royal flex items-center justify-center mt-0.5">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {t}
                </li>
              ))}
            </ul>
            <Link
              href="/sobre"
              className="mt-7 inline-flex items-center gap-2 text-royal font-semibold hover:gap-3 transition-all"
            >
              Conheça a nossa história
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </Revelar>

          {/* Cartão dos números */}
          <Revelar atraso={140}>
            <div className="bg-royal rounded-[2rem] p-10 md:p-12 text-white relative overflow-hidden">
              <div className="relative grid grid-cols-2 gap-8">
                <div>
                  <p className="font-display text-5xl font-semibold">{ANOS_TRADICAO}</p>
                  <p className="text-white/70 mt-1">anos de tradição</p>
                </div>
                <div>
                  <p className="font-display text-5xl font-semibold">3</p>
                  <p className="text-white/70 mt-1">unidades em Petrópolis</p>
                </div>
                <div>
                  <p className="font-display text-5xl font-semibold">{AVALIACOES_GOOGLE_NOTA.toFixed(1)}</p>
                  <p className="text-white/70 mt-1">nota no Google</p>
                </div>
                <div>
                  <p className="font-display text-5xl font-semibold">100%</p>
                  <p className="text-white/70 mt-1">fórmulas sob medida</p>
                </div>
              </div>
              <div className="absolute -right-16 -top-20 w-56 h-56 rounded-full bg-white/5" aria-hidden="true" />
            </div>
          </Revelar>
        </div>
      </section>

      {/* 6 ─ PRODUTOS: vitaminas e suplementos */}
      {produtosVitaminas.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-8 pt-20">
          <Revelar>
            <SecaoTitulo
              selo="para o seu dia a dia"
              titulo="Vitaminas e suplementos"
              descricao="Energia, imunidade e bem-estar, na dose que o seu corpo precisa."
              verTudo="/produtos"
            />
            <FaixaProdutos produtos={produtosVitaminas} />
          </Revelar>
        </section>
      )}

      {/* 7 ─ DELIVERY */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pt-20">
        <Revelar>
          <div className="bg-royal-nevoa border border-linha rounded-[2rem] px-8 md:px-14 py-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="selo-secao text-royal">até a sua porta</p>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-grafite leading-tight mt-2">
                Receba seus manipulados
                <br />
                <span className="italic">sem sair de casa</span>
              </h2>
              <p className="text-grafite-medio text-lg leading-relaxed mt-4">
                Monte o pedido pelo site, finalize no WhatsApp e combine a entrega com a
                nossa equipe. Se preferir, retire em qualquer uma das 3 unidades.
              </p>
              <a
                href="https://wa.me/5524988733934"
                target="_blank"
                rel="noopener noreferrer"
                className="degrade-suave mt-7 inline-flex items-center gap-3 text-white text-lg font-semibold rounded-2xl px-8 py-4 active:scale-95 transition-transform"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm5.5 14.2c-.2.7-1.3 1.3-1.9 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.2-.3.5-.4.7-.4h.5c.2 0 .4 0 .6.4l.9 2.1c.1.2.1.4 0 .6l-.4.6-.5.5c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1.1 2.1 1.4 2.5 1.6.3.1.5.1.6-.1l.8-1c.2-.3.4-.2.7-.1l2.1 1c.3.1.5.2.6.4 0-.1 0 .6-.2 1.3Z" />
                </svg>
                Pedir pelo WhatsApp
              </a>
            </div>

            {/* Passos do delivery */}
            <div className="flex flex-col gap-3">
              {[
                { n: "1", t: "Escolha seus produtos", d: "Navegue pelo catálogo e adicione ao carrinho." },
                { n: "2", t: "Finalize no WhatsApp", d: "O pedido chega pronto para a nossa equipe." },
                { n: "3", t: "Receba ou retire", d: "Entrega combinada com você ou retirada em loja." },
              ].map((p, i) => (
                <Revelar key={p.n} atraso={i * 120}>
                  <div className="bg-white border border-linha rounded-2xl p-5 flex items-start gap-4 sombra-card">
                    <span className="shrink-0 w-11 h-11 rounded-xl degrade-marca text-white flex items-center justify-center font-display text-lg font-semibold">
                      {p.n}
                    </span>
                    <div>
                      <p className="font-bold text-grafite">{p.t}</p>
                      <p className="text-grafite-medio text-sm mt-0.5">{p.d}</p>
                    </div>
                  </div>
                </Revelar>
              ))}
            </div>
          </div>
        </Revelar>
      </section>

      {/* 8 ─ DESTAQUES: linha dermatológica */}
      {dermatologicos.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-8 pt-20">
          <Revelar>
            <div className="bg-royal rounded-[2rem] px-6 md:px-12 py-12 md:py-16">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
                <div>
                  <p className="selo-secao text-white/75">beleza autêntica</p>
                  <h2 className="font-display text-3xl md:text-4xl font-semibold text-white mt-2 leading-tight">
                    Cuidados dermatológicos
                    <br />
                    <span className="italic">sob medida</span>
                  </h2>
                  <p className="text-white/75 text-lg mt-3 max-w-xl">
                    Cremes, séruns e fórmulas estéticas personalizadas para a sua pele.
                  </p>
                </div>
                <Link
                  href="/produtos"
                  className="shrink-0 inline-flex items-center gap-2 bg-white text-royal font-semibold rounded-2xl px-6 py-3.5 active:scale-95 transition-transform"
                >
                  Ver linha completa
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
              <FaixaProdutos produtos={dermatologicos} />
            </div>
          </Revelar>
        </section>
      )}

      {/* 9 ─ DESTAQUES: avaliações do Google */}
      {avaliacoes.length > 0 && (
        <Revelar>
          <CarrosselAvaliacoes media={AVALIACOES_GOOGLE_NOTA} avaliacoes={avaliacoes} />
        </Revelar>
      )}

      {/* 10 ─ INSTAGRAM: os vídeos da farmácia */}
      <Revelar>
        <ReelsInstagram />
      </Revelar>

      {/* 11 ─ PRODUTOS: combos especiais */}
      {combos.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-8 pt-16 pb-24">
          <Revelar>
            <SecaoTitulo
              selo="mais completo, mais vantajoso"
              titulo="Combos especiais"
              descricao="Tratamentos completos que se complementam, em um pedido só."
            />
            <FaixaProdutos produtos={combos} />
          </Revelar>
        </section>
      )}
    </main>
  );
}
