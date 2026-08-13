// POST /api/pedidos — registra o cliente e o resumo do pedido no momento
// da finalização (antes de abrir o WhatsApp). É a base de clientes para
// marketing e recompra, exibida no painel do gestor.
//
// Rota pública (o cliente do site não tem login). Validação simples e
// nenhum dado sensível além de nome e WhatsApp, com consentimento
// informado na tela de finalização (LGPD).
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const corpo = await req.json().catch(() => ({}));

  const nome = String(corpo.nome ?? "").trim().slice(0, 120);
  const whatsapp = String(corpo.whatsapp ?? "").trim().slice(0, 30);
  const pagamento = String(corpo.pagamento ?? "").trim().slice(0, 40);
  const entrega = String(corpo.entrega ?? "").trim().slice(0, 40);
  const local = String(corpo.local ?? "").trim().slice(0, 200);
  const codigo = String(corpo.codigo ?? "").trim().slice(0, 12);
  const totalCentavos = Number(corpo.totalCentavos);
  const itens = Array.isArray(corpo.itens) ? corpo.itens : [];

  if (!nome || whatsapp.replace(/\D/g, "").length < 10 || itens.length === 0) {
    return NextResponse.json({ erro: "Dados incompletos." }, { status: 400 });
  }

  // Guarda só o essencial de cada item (nada de dados do navegador)
  const itensLimpos = itens.slice(0, 60).map((i: Record<string, unknown>) => ({
    nome: String(i.nome ?? "").slice(0, 120),
    dosagem: i.dosagem ? String(i.dosagem).slice(0, 40) : null,
    quantidade: Number(i.quantidade) || 1,
    precoCentavos: Number(i.precoCentavos) || 0,
  }));

  await db.cliente.create({
    data: {
      nome,
      whatsapp,
      pagamento,
      entrega,
      local,
      codigo,
      totalCentavos: Number.isFinite(totalCentavos) ? totalCentavos : 0,
      itens: JSON.stringify(itensLimpos),
    },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
