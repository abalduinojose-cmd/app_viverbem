import { db } from "./db";

// Converte um nome em slug para URLs/identificação.
// Ex.: "Dermatologia & Estética" -> "dermatologia-estetica"
export function gerarSlug(nome: string): string {
  return nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // remove acentos (marcas de combinação)
    .replace(/[^a-z0-9]+/g, "-") // troca símbolos/espaços por hífen
    .replace(/^-+|-+$/g, ""); // remove hífens das pontas
}

/** Gera um slug único de PRODUTO (se já existir, ganha sufixo -2, -3...). */
export async function gerarSlugProdutoUnico(nome: string): Promise<string> {
  const base = gerarSlug(nome) || "produto";
  let slug = base;
  let n = 2;
  // Repete até achar um slug livre
  while (await db.produto.findUnique({ where: { slug }, select: { id: true } })) {
    slug = `${base}-${n++}`;
  }
  return slug;
}
