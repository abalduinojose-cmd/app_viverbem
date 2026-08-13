// Regras para os buscadores: site liberado, painel e APIs fora do índice.
import type { MetadataRoute } from "next";

const URL_SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api"],
    },
    sitemap: `${URL_SITE}/sitemap.xml`,
  };
}
