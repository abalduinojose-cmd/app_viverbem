// Valida e normaliza o corpo do produto enviado pelo formulário do
// painel (usado nas rotas de criar e editar produto).
import { TIPO_COMBO, TIPO_PRODUTO } from "@/lib/tipos";

export function validarCorpoProduto(corpo: Record<string, unknown>) {
  const nome = String(corpo.nome ?? "").trim();
  const descricao = String(corpo.descricao ?? "").trim();
  const precoCentavos = Number(corpo.precoCentavos);
  const tipo = corpo.tipo === TIPO_COMBO ? TIPO_COMBO : TIPO_PRODUTO;

  if (!nome) return { erro: "Informe o nome do produto." } as const;
  if (!descricao) return { erro: "Informe a descrição." } as const;
  if (!Number.isInteger(precoCentavos) || precoCentavos < 0)
    return { erro: "Preço inválido." } as const;

  return {
    dados: {
      nome,
      descricao,
      precoCentavos,
      tipo,
      fotoUrl: corpo.fotoUrl ? String(corpo.fotoUrl) : null,
      ativo: corpo.ativo !== false,
      novidade: corpo.novidade === true,
      destaque: corpo.destaque === true,
      categoriaId: corpo.categoriaId ? Number(corpo.categoriaId) : null,
      // Dosagens: texto livre separado por vírgula (ex.: "250mg, 500mg")
      dosagens: corpo.dosagens ? String(corpo.dosagens).trim() || null : null,
      composicao: corpo.composicao ? String(corpo.composicao).trim() || null : null,
      modoUso: corpo.modoUso ? String(corpo.modoUso).trim() || null : null,
      indicacoes: corpo.indicacoes ? String(corpo.indicacoes).trim() || null : null,
      apresentacao: corpo.apresentacao ? String(corpo.apresentacao).trim() || null : null,
    },
  } as const;
}
