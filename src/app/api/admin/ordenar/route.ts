// POST /api/admin/ordenar — salva a nova ordem após o drag-and-drop.
// Corpo: { tipo: "categorias" | "produtos", ids: [3, 1, 2, ...] }
// (a posição no array vira o campo "ordem" de cada registro)
// Permissão: SOMENTE ADMIN (reordenar a vitrine é curadoria).
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { exigirAdminApi } from "@/lib/sessao";
import { registrarLog } from "@/lib/log";

export async function POST(req: Request) {
  const sessao = await exigirAdminApi();
  if (!sessao) {
    return NextResponse.json(
      { erro: "Apenas administradores podem reordenar." },
      { status: 403 }
    );
  }

  const corpo = await req.json().catch(() => ({}));
  const tipo = corpo.tipo;
  const ids: unknown[] = Array.isArray(corpo.ids) ? corpo.ids : [];

  if ((tipo !== "categorias" && tipo !== "produtos") || ids.length === 0) {
    return NextResponse.json({ erro: "Dados de ordenação inválidos." }, { status: 400 });
  }

  // Atualiza tudo numa transação: posição no array = nova ordem
  const atualizacoes = ids.map((id, indice) =>
    tipo === "categorias"
      ? db.categoria.update({ where: { id: Number(id) }, data: { ordem: indice } })
      : db.produto.update({ where: { id: Number(id) }, data: { ordem: indice } })
  );
  await db.$transaction(atualizacoes);

  await registrarLog(sessao.nome ?? "?", "reordenou", tipo);
  return NextResponse.json({ ok: true });
}
