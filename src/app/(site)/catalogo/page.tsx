// Catálogo do TOTEM — carrega os dados no servidor e entrega para o
// componente de cliente, que cuida da navegação por toque.
import { obterCatalogo } from "@/lib/catalogo";
import { CatalogoClient } from "@/components/totem/CatalogoClient";

// Sempre buscar dados frescos do banco (alterações do painel
// aparecem no totem na próxima navegação/toque)
export const dynamic = "force-dynamic";

export default async function PaginaCatalogo() {
  const { categorias, produtos } = await obterCatalogo();
  return <CatalogoClient categorias={categorias} produtos={produtos} />;
}
