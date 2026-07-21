// POST /api/admin/depoimentos — cria um depoimento/avaliação.
// Permissão: SOMENTE ADMIN.
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { exigirAdminApi } from "@/lib/sessao";
import { registrarLog } from "@/lib/log";

export async function POST(req: Request) {
  const sessao = await exigirAdminApi();
  if (!sessao) {
    return NextResponse.json(
      { erro: "Apenas administradores podem gerenciar depoimentos." },
      { status: 403 }
    );
  }

  const corpo = await req.json().catch(() => ({}));
  const nome = String(corpo.nome ?? "").trim();
  const texto = String(corpo.texto ?? "").trim();
  const nota = Math.min(5, Math.max(1, Number(corpo.nota) || 5));
  const fonte = corpo.fonte === "Loja" ? "Loja" : "Google";
  if (!nome || !texto) {
    return NextResponse.json({ erro: "Informe o nome e o depoimento." }, { status: 400 });
  }

  const ultimo = await db.depoimento.findFirst({ orderBy: { ordem: "desc" } });
  const depoimento = await db.depoimento.create({
    data: { nome, texto, nota, fonte, ordem: (ultimo?.ordem ?? -1) + 1 },
  });
  await registrarLog(sessao.nome ?? "?", "criou avaliação", `de "${nome}" (${nota}★ ${fonte})`);
  return NextResponse.json(depoimento, { status: 201 });
}
