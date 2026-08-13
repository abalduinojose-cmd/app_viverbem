// Página exclusiva de cada produto — é este o link divulgado no
// Instagram (bio, stories e destaques). Ao compartilhar, aparece a
// miniatura com a foto e o nome do produto (Open Graph).
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { obterCatalogo } from "@/lib/catalogo";
import { formatarPreco } from "@/lib/preco";
import { TIPO_COMBO } from "@/lib/tipos";
import { FotoProduto } from "@/components/totem/FotoProduto";
import { AcoesProduto } from "@/components/site/AcoesProduto";
import { FaixaProdutos } from "@/components/site/FaixaProdutos";

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

export default async function PaginaProduto({ params }: Props) {
  const { slug } = await params;
  const { produtos } = await obterCatalogo();
  const produto = produtos.find((p) => p.slug === slug);
  if (!produto) notFound();

  const relacionados = produtos
    .filter((p) => p.categoriaId === produto.categoriaId && p.id !== produto.id)
    .slice(0, 8);

  return (
    <main className="flex-1 pt-16 md:pt-[4.5rem]">
      {/* Trilha de navegação */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-6">
        <nav className="flex items-center gap-2 text-sm text-grafite-claro" aria-label="Você está em">
          <Link href="/" className="hover:text-royal transition-colors">Início</Link>
          <span aria-hidden="true">/</span>
          <Link href="/catalogo" className="hover:text-royal transition-colors">Catálogo</Link>
          <span aria-hidden="true">/</span>
          <span className="text-grafite-medio truncate max-w-[12rem] md:max-w-none">{produto.nome}</span>
        </nav>
      </div>

      {/* Produto */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 pt-6 pb-4">
        <div className="bg-white border border-linha rounded-[2rem] sombra-card overflow-hidden md:grid md:grid-cols-2">
          {/* Foto */}
          <div className="relative bg-gradient-to-b from-royal-nevoa to-royal-claro/70 flex items-center justify-center min-h-[19rem] md:min-h-[30rem] p-8 md:p-12">
            <div className="absolute top-5 left-5 flex flex-col gap-2 items-start">
              {produto.novidade && (
                <span className="bg-escarlate text-white text-[0.65rem] font-semibold tracking-wide px-3 py-1.5 rounded-full shadow-sm">
                  NOVIDADE
                </span>
              )}
              {produto.tipo === TIPO_COMBO && (
                <span className="bg-royal text-white text-[0.65rem] font-semibold tracking-wide px-3 py-1.5 rounded-full shadow-sm">
                  COMBO
                </span>
              )}
            </div>
            <FotoProduto
              fotoUrl={produto.fotoUrl}
              nome={produto.nome}
              className="max-w-full max-h-[26rem] !object-contain drop-shadow-xl"
            />
          </div>

          {/* Informações + ações (dosagem, quantidade, carrinho) */}
          <div className="p-6 md:p-10 flex flex-col">
            {produto.categoriaNome && (
              <span className="self-start text-[0.65rem] font-semibold tracking-[0.18em] uppercase text-royal bg-royal-claro px-3 py-1.5 rounded-full">
                {produto.categoriaNome}
              </span>
            )}
            <h1 className="text-3xl md:text-4xl font-bold text-grafite tracking-tight leading-tight mt-4">
              {produto.nome}
            </h1>
            <p className="text-grafite-medio text-base md:text-lg mt-3 leading-relaxed">
              {produto.descricao}
            </p>

            <AcoesProduto produto={produto} />

            <p className="text-grafite-claro text-sm mt-5 leading-relaxed">
              Adicione ao carrinho e finalize o pedido pelo WhatsApp. A nossa equipe
              recebe a lista pronta e combina o pagamento e a retirada ou entrega com você.
            </p>
          </div>
        </div>
      </section>

      {/* Relacionados */}
      {relacionados.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 md:px-8 pt-10 pb-20">
          <h2 className="text-2xl md:text-3xl font-bold text-grafite tracking-tight mb-6">
            Você também pode gostar
          </h2>
          <FaixaProdutos produtos={relacionados} />
        </section>
      )}
    </main>
  );
}
