// Números do negócio para o painel do gestor.
//
// Tudo sai da tabela Cliente, que guarda um pedido por linha com os
// itens em JSON. Como o volume é pequeno (uma farmácia, não um
// marketplace), lemos os pedidos do período e contamos em memória —
// mais simples do que espalhar SQL pelo código.
import { db } from "./db";
import { ENTREGA_RETIRADA } from "./tipos";

export interface ItemDoPedido {
  nome: string;
  dosagem: string | null;
  quantidade: number;
  precoCentavos: number;
}

/** Lê os itens de um pedido, tolerando registro antigo ou corrompido. */
export function lerItens(json: string): ItemDoPedido[] {
  try {
    const lista = JSON.parse(json);
    return Array.isArray(lista) ? lista : [];
  } catch {
    return [];
  }
}

function inicioDoMes(deslocamento = 0) {
  const hoje = new Date();
  return new Date(hoje.getFullYear(), hoje.getMonth() + deslocamento, 1);
}

/** Variação percentual entre dois números (null quando não dá para comparar). */
function variacao(atual: number, anterior: number): number | null {
  if (anterior === 0) return atual === 0 ? 0 : null;
  return Math.round(((atual - anterior) / anterior) * 100);
}

export async function obterMetricas() {
  const comecoDesteMes = inicioDoMes();
  const comecoDoMesPassado = inicioDoMes(-1);

  const [doMes, doMesPassado, totalPedidos, produtos, ultimos] = await Promise.all([
    db.cliente.findMany({ where: { criadoEm: { gte: comecoDesteMes } } }),
    db.cliente.findMany({
      where: { criadoEm: { gte: comecoDoMesPassado, lt: comecoDesteMes } },
    }),
    db.cliente.count(),
    db.produto.findMany({
      select: {
        id: true,
        nome: true,
        ativo: true,
        precoCentavos: true,
        fotoUrl: true,
        categoriaId: true,
      },
    }),
    db.cliente.findMany({ orderBy: { criadoEm: "desc" }, take: 5 }),
  ]);

  const faturamentoMes = doMes.reduce((s, c) => s + c.totalCentavos, 0);
  const faturamentoAnterior = doMesPassado.reduce((s, c) => s + c.totalCentavos, 0);

  // Quantas vezes cada produto foi pedido no mês (soma as quantidades)
  const contagem = new Map<string, number>();
  for (const pedido of doMes) {
    for (const item of lerItens(pedido.itens)) {
      const qtd = Number(item.quantidade) || 0;
      contagem.set(item.nome, (contagem.get(item.nome) ?? 0) + qtd);
    }
  }
  const maisPedidos = [...contagem.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([nome, quantidade]) => ({ nome, quantidade }));

  const retiradas = doMes.filter((c) => c.entrega === ENTREGA_RETIRADA).length;
  const entregas = doMes.filter((c) => c.entrega && c.entrega !== ENTREGA_RETIRADA).length;

  // O que precisa de atenção no catálogo
  const alertas = {
    inativos: produtos.filter((p) => !p.ativo).length,
    semFoto: produtos.filter((p) => !p.fotoUrl).length,
    semPreco: produtos.filter((p) => p.precoCentavos <= 0).length,
    semCategoria: produtos.filter((p) => p.categoriaId === null).length,
  };

  return {
    pedidosMes: doMes.length,
    pedidosVariacao: variacao(doMes.length, doMesPassado.length),
    faturamentoMes,
    faturamentoVariacao: variacao(faturamentoMes, faturamentoAnterior),
    ticketMedio: doMes.length > 0 ? Math.round(faturamentoMes / doMes.length) : 0,
    clientesUnicos: new Set(doMes.map((c) => c.whatsapp.replace(/\D/g, ""))).size,
    totalPedidos,
    maisPedidos,
    retiradas,
    entregas,
    alertas,
    totalProdutos: produtos.length,
    ultimos: ultimos.map((c) => ({
      id: c.id,
      nome: c.nome,
      codigo: c.codigo,
      totalCentavos: c.totalCentavos,
      entrega: c.entrega,
      criadoEm: c.criadoEm.toISOString(),
    })),
  };
}
