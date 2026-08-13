// Página exclusiva de cada produto — é este o link divulgado no
// Instagram (bio, stories e destaques). Ao compartilhar, aparece a
// miniatura com a foto e o nome do produto (Open Graph).
//
// Layout enxuto: foto à esquerda, compra à direita e os detalhes da
// fórmula recolhidos em sanfonas, para não empurrar o botão de compra
// para longe. Ao final, o que a pessoa já viu no site.
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { obterCatalogo } from "@/lib/catalogo";
import { formatarPreco } from "@/lib/preco";
import { TIPO_COMBO, listarItens, listarDosagens } from "@/lib/tipos";
import { FotoProduto } from "@/components/totem/FotoProduto";
import { AcoesProduto } from "@/components/site/AcoesProduto";
import { FaixaProdutos } from "@/components/site/FaixaProdutos";
import { VistosRecentemente } from "@/components/site/VistosRecentemente";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

// Miniatura e título ao compartilhar o link (WhatsApp, Instagram, Google)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { produtos } = await obterCatalogo();
  const produto = produtos.find((p) => p.slug === slug);
  if (!produto) return { title: "Produto não encontrado" };

  const titulo = `${produto.nome} · Manipulação Viver Bem`;
  const descricao = `${formatarPreco(produto.precoCentavos)} · ${produto.descricao}`;
  return {
    title: titulo,
    description: descricao,
    openGraph: {
      title: titulo,
      description: descricao,
      type: "website",
      images: produto.fotoUrl ? [{ url: produto.fotoUrl }] : undefined,
    },
  };
}

// Na vitrine estática (GitHub Pages) todas as páginas de produto são
// geradas de uma vez a partir do retrato do banco.
export async function generateStaticParams() {
  if (process.env.DEMO !== "1") return [];
  const { produtos } = await obterCatalogo();
  return produtos.map((p) => ({ slug: p.slug }));
}

// Sanfona de detalhe: fechada por padrão, abre no clique. Sem
// JavaScript, é o <details> nativo do navegador.
function Sanfona({
  titulo,
  itens,
  texto,
}: {
  titulo: string;
  itens?: string[];
  texto?: string | null;
}) {
  const temLista = itens && itens.length > 0;
  if (!temLista && !texto) return null;

  return (
    <details className="group border-b border-linha py-1.5">
      <summary className="flex items-center justify-between gap-4 min-h-12 cursor-pointer list-none font-semibold text-grafite marker:content-['']">
        {titulo}
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className="shrink-0 text-grafite-claro transition-transform group-open:rotate-180"
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </summary>

      {temLista ? (
        <ul className="mb-3 flex flex-col gap-2">
          {itens.map((i) => (
            <li key={i} className="flex items-start gap-2.5 text-grafite-medio leading-relaxed">
              <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-escarlate mt-2.5" aria-hidden="true" />
              {i}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mb-3 text-grafite-medio leading-relaxed whitespace-pre-line">{texto}</p>
      )}
    </details>
  );
}

export default async function PaginaProduto({ params }: Props) {
  const { slug } = await params;
  const { produtos } = await obterCatalogo();
  const produto = produtos.find((p) => p.slug === slug);
  if (!produto) notFound();

  const relacionados = produtos
    .filter((p) => p.categoriaId === produto.categoriaId && p.id !== produto.id)
    .slice(0, 8);

  const indicacoes = listarItens(produto.indicacoes);
  const composicao = listarItens(produto.composicao);
  const dosagens = listarDosagens(produto.dosagens);

  return (
    <main className="flex-1 pt-16 md:pt-[4.5rem] bg-white">
      {/* Trilha de navegação */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-7">
        <nav className="flex items-center gap-2 text-sm text-grafite-claro min-h-10" aria-label="Você está em">
          <Link href="/" className="hover:text-royal transition-colors">Início</Link>
          <span aria-hidden="true">/</span>
          <Link href="/produtos" className="hover:text-royal transition-colors">Produtos</Link>
          <span aria-hidden="true">/</span>
          <span className="text-grafite-medio truncate max-w-[12rem] md:max-w-none">{produto.nome}</span>
        </nav>
      </div>

      {/* Produto */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 pt-8 pb-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
          {/* Foto */}
          <div className="relative bg-royal-nevoa rounded-[2rem] border border-linha flex items-center justify-center min-h-[20rem] md:min-h-[30rem] p-10 md:p-14 md:self-start">
            <div className="absolute top-6 left-6 flex flex-col gap-2 items-start">
              {produto.novidade && (
                <span className="bg-escarlate text-white text-[0.65rem] font-semibold tracking-wide px-3 py-1.5 rounded-full">
                  NOVIDADE
                </span>
              )}
              {produto.tipo === TIPO_COMBO && (
                <span className="bg-royal text-white text-[0.65rem] font-semibold tracking-wide px-3 py-1.5 rounded-full">
                  COMBO
                </span>
              )}
            </div>
            <FotoProduto
              fotoUrl={produto.fotoUrl}
              nome={produto.nome}
              className="max-w-full max-h-[24rem] !object-contain"
              prioritaria
            />
          </div>

          {/* Compra */}
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2">
              {produto.categoriaNome && (
                <Link
                  href="/produtos"
                  className="inline-flex items-center min-h-9 text-[0.65rem] font-semibold tracking-[0.18em] uppercase text-royal bg-royal-claro hover:bg-royal hover:text-white px-3.5 rounded-full transition-colors"
                >
                  {produto.categoriaNome}
                </Link>
              )}
              {produto.apresentacao && (
                <span className="text-[0.65rem] font-semibold tracking-[0.18em] uppercase text-grafite-medio bg-royal-nevoa border border-linha px-3 py-1.5 rounded-full">
                  {produto.apresentacao}
                </span>
              )}
            </div>

            <h1 className="font-display text-3xl md:text-[2.7rem] font-semibold text-grafite leading-[1.1] mt-5">
              {produto.nome}
            </h1>
            <p className="text-grafite-medio text-base md:text-lg mt-4 leading-relaxed">
              {produto.descricao}
            </p>

            <AcoesProduto produto={produto} />

            {/* Selos de confiança */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6">
              {[
                "Manipulado sob medida",
                dosagens.length > 0 ? "Dosagem à sua escolha" : "Matéria-prima certificada",
              ].map((s) => (
                <span key={s} className="inline-flex items-center gap-2 text-sm text-grafite-medio">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-royal">
                    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {s}
                </span>
              ))}
            </div>

            {/* Detalhes da fórmula, recolhidos */}
            <div className="mt-7 border-t border-linha">
              <Sanfona titulo="Indicações" itens={indicacoes} />
              <Sanfona titulo="Composição" itens={composicao} />
              <Sanfona titulo="Modo de uso" texto={produto.modoUso} />
            </div>

            <p className="text-grafite-claro text-sm mt-6 leading-relaxed">
              Você monta o pedido aqui e finaliza pelo WhatsApp. Este produto não
              substitui uma consulta: use conforme a orientação do seu médico ou do
              farmacêutico da Viver Bem.
            </p>
          </div>
        </div>
      </section>

      {/* Relacionados */}
      {relacionados.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 md:px-8 pt-4 pb-14 border-t border-linha">
          <p className="selo-secao text-escarlate mt-10">combina com</p>
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-grafite mt-1 mb-6">
            Você também pode gostar
          </h2>
          <FaixaProdutos produtos={relacionados} />
        </section>
      )}

      {/* O que a pessoa já abriu no site */}
      <VistosRecentemente slugAtual={produto.slug} catalogo={produtos} />
    </main>
  );
}
