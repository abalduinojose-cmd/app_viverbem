// PATCH  /api/admin/depoimentos/:id — edita nome/texto ou alterna "ativo"
// DELETE /api/admin/depoimentos/:id — apaga o depoimento
// Permissão: SOMENTE ADMIN.
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { exigirAdminApi } from "@/lib/sessao";
import { registrarLog } from "@/lib/log";

type Contexto = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, contexto: Contexto) {
  const sessao = await exigirAdminApi();
  if (!sessao) {
    return NextResponse.json(
      { erro: "Apenas administradores podem gerenciar depoimentos." },
      { status: 403 }
    );
  }

  const { id } = await contexto.params;
  const corpo = await req.json().catch(() => ({}));

  const dados: { nome?: string; texto?: string; ativo?: boolean; nota?: number; fonte?: string } =
    {};
  if (typeof corpo.nome === "string" && corpo.nome.trim()) dados.nome = corpo.nome.trim();
  if (typeof corpo.texto === "string" && corpo.texto.trim()) dados.texto = corpo.texto.trim();
  if (typeof corpo.ativo === "boolean") dados.ativo = corpo.ativo;
  if (corpo.nota !== undefined) dados.nota = Math.min(5, Math.max(1, Number(corpo.nota) || 5));
  if (corpo.fonte === "Google" || corpo.fonte === "Loja") dados.fonte = corpo.fonte;

  if (Object.keys(dados).length === 0) {
    return NextResponse.json({ erro: "Nada para atualizar." }, { status: 400 });
  }

  const depoimento = await db.depoimento.update({ where: { id: Number(id) }, data: dados });
  await registrarLog(sessao.nome ?? "?", "alterou depoimento", `de "${depoimento.nome}"`);
  return NextResponse.json(depoimento);
}

export async function DELETE(_req: Request, contexto: Contexto) {
  const sessao = await exigirAdminApi();
  if (!sessao) {
    return NextResponse.json(
      { erro: "Apenas administradores podem gerenciar depoimentos." },
      { status: 403 }
    );
  }

  const { id } = await contexto.params;
  const depoimento = await db.depoimento.delete({ where: { id: Number(id) } });
  await registrarLog(sessao.nome ?? "?", "apagou depoimento", `de "${depoimento.nome}"`);
  return NextResponse.json({ ok: true });
}
