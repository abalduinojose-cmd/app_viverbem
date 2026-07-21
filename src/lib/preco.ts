// Helpers de preço — o banco guarda preços em CENTAVOS (inteiro)
// para evitar erros de arredondamento. Estes helpers convertem
// entre centavos e o formato brasileiro "R$ 0,00".

/** 4990 -> "R$ 49,90" */
export function formatarPreco(centavos: number): string {
  return (centavos / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

/** "49,90" ou "R$ 49,90" ou "49.90" -> 4990. Retorna null se inválido. */
export function converterPrecoParaCentavos(texto: string): number | null {
  const limpo = texto
    .replace(/[R$\s.]/g, "") // remove "R$", espaços e pontos de milhar
    .replace(",", ".");
  const valor = Number(limpo);
  if (isNaN(valor) || valor < 0) return null;
  return Math.round(valor * 100);
}

/** 4990 -> "49,90" (para preencher inputs de edição) */
export function centavosParaInput(centavos: number): string {
  return (centavos / 100).toFixed(2).replace(".", ",");
}
