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
