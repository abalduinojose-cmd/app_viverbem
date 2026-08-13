// Sitemap para o Google: páginas fixas + a página de cada produto.
import type { MetadataRoute } from "next";
import { obterCatalogo } from "@/lib/catalogo";

const URL_SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { produtos } = await obterCatalogo();

  const fixas: MetadataRoute.Sitemap = [
    { url: `${URL_SITE}/`, priority: 1 },
    { url: `${URL_SITE}/catalogo`, priority: 0.9 },
    { url: `${URL_SITE}/sobre`, priority: 0.6 },
    { url: `${URL_SITE}/contato`, priority: 0.6 },
  ];

  const paginasProdutos: MetadataRoute.Sitemap = produtos.map((p) => ({
    url: `${URL_SITE}/produto/${p.slug}`,
    priority: 0.8,
  }));

  return [...fixas, ...paginasProdutos];
}
