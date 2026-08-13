// Página exclusiva de cada produto — é este o link divulgado no
// Instagram (bio, stories e destaques). Ao compartilhar, aparece a
// miniatura com a foto e o nome do produto (Open Graph).
//
// Layout clean: foto grande à esquerda, compra à direita e, abaixo,
// as informações do produto (indicações, composição, modo de uso).
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { obterCatalogo } from "@/lib/catalogo";
import { formatarPreco } from "@/lib/preco";
import { TIPO_COMBO, listarItens, listarDosagens } from "@/lib/tipos";
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

// Bloco de informação do produto (só aparece se houver conteúdo)
function BlocoInfo({
  titulo,
  itens,
  texto,
  icone,
}: {
  titulo: string;
  itens?: string[];
  texto?: string | null;
  icone: React.ReactNode;
}) {
  const temLista = itens && itens.length > 0;
  if (!temLista && !texto) return null;

  return (
    <div className="bg-white border border-linha rounded-3xl p-7">
      <div className="flex items-center gap-3">
        <span className="w-10 h-10 rounded-xl bg-royal-claro text-royal flex items-center justify-center shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {icone}
          </svg>
        </span>
        <h2 className="font-display text-xl font-semibold text-grafite">{titulo}</h2>
      </div>

      {temLista ? (
        <ul className="mt-5 flex flex-col gap-2.5">
          {itens.map((i) => (
            <li key={i} className="flex items-start gap-3 text-grafite-medio leading-relaxed">
              <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-escarlate mt-2.5" aria-hidden="true" />
              {i}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-grafite-medio leading-relaxed whitespace-pre-line">{texto}</p>
      )}
    </div>
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
  const temInfoExtra =
    indicacoes.length > 0 || composicao.length > 0 || Boolean(produto.modoUso);

  return (
    <main className="flex-1 pt-16 md:pt-[4.5rem] bg-white">
      {/* Trilha de navegação */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-7">
        <nav className="flex items-center gap-2 text-sm text-grafite-claro" aria-label="Você está em">
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
          <div className="relative bg-royal-nevoa rounded-[2rem] border border-linha flex items-center justify-center min-h-[20rem] md:min-h-[32rem] p-10 md:p-14">
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
              className="max-w-full max-h-[26rem] !object-contain"
            />
          </div>

          {/* Compra */}
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2">
              {produto.categoriaNome && (
                <Link
                  href="/produtos"
                  className="text-[0.65rem] font-semibold tracking-[0.18em] uppercase text-royal bg-royal-claro hover:bg-royal hover:text-white px-3 py-1.5 rounded-full transition-colors"
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

            {/* Selos de confiança */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6">
              {[
                "Manipulado sob medida",
                "Matéria-prima certificada",
                dosagens.length > 0 ? "Dosagem à sua escolha" : "Retirada ou entrega",
              ].map((s) => (
                <span key={s} className="inline-flex items-center gap-2 text-sm text-grafite-medio">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-royal">
                    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {s}
                </span>
              ))}
            </div>

            <AcoesProduto produto={produto} />

            <p className="text-grafite-claro text-sm mt-5 leading-relaxed">
              Você monta o pedido aqui e finaliza pelo WhatsApp. A nossa equipe recebe a
              lista pronta e combina o pagamento e a retirada ou entrega com você.
            </p>
          </div>
        </div>
      </section>

      {/* Informações do produto */}
      {temInfoExtra && (
        <section className="bg-[#fbfcfe] border-y border-linha">
          <div className="max-w-6xl mx-auto px-4 md:px-8 py-14">
            <p className="palavra-script text-2xl text-royal">conheça a fórmula</p>
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-grafite mt-1 mb-8">
              Informações do produto
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
              <BlocoInfo
                titulo="Indicações"
                itens={indicacoes}
                icone={
                  <path
                    d="M12 20.5s-7-4.4-7-9.5a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.1-7 9.5-7 9.5Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinejoin="round"
                  />
                }
              />
              <BlocoInfo
                titulo="Composição"
                itens={composicao}
                icone={
                  <>
                    <path d="M9 3v7.2L4.8 17a2.4 2.4 0 0 0 2.1 3.6h10.2a2.4 2.4 0 0 0 2.1-3.6L15 10.2V3" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                    <path d="M7.5 3h9M7 14.5h10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                  </>
                }
              />
              <BlocoInfo
                titulo="Modo de uso"
                texto={produto.modoUso}
                icone={
                  <>
                    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
                    <path d="M12 7.5v5l3 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </>
                }
              />
            </div>

            <p className="text-grafite-claro text-sm mt-7 leading-relaxed max-w-3xl">
              Este produto não substitui uma consulta. Use conforme a orientação do seu
              médico ou do farmacêutico da Viver Bem. Imagens meramente ilustrativas.
            </p>
          </div>
        </section>
      )}

      {/* Relacionados */}
      {relacionados.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 md:px-8 pt-14 pb-20">
          <p className="palavra-script text-2xl text-escarlate">combina com</p>
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-grafite mt-1 mb-6">
            Você também pode gostar
          </h2>
          <FaixaProdutos produtos={relacionados} />
        </section>
      )}
    </main>
  );
}
