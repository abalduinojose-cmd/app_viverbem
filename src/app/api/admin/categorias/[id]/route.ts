// PATCH  /api/admin/categorias/:id — renomeia a categoria
// DELETE /api/admin/categorias/:id — apaga a categoria
//         (os produtos dela NÃO são apagados — ficam "sem categoria")
// Permissão: SOMENTE ADMIN (operador não gerencia categorias).
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { exigirAdminApi } from "@/lib/sessao";
import { gerarSlug } from "@/lib/slug";
import { registrarLog } from "@/lib/log";

type Contexto = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, contexto: Contexto) {
  const sessao = await exigirAdminApi();
  if (!sessao) {
    return NextResponse.json(
      { erro: "Apenas administradores podem gerenciar categorias." },
      { status: 403 }
    );
  }

  const { id } = await contexto.params;
  const corpo = await req.json().catch(() => ({}));
  const nome = String(corpo.nome ?? "").trim();
  if (!nome) {
    return NextResponse.json({ erro: "Informe o nome da categoria." }, { status: 400 });
  }

  const anterior = await db.categoria.findUnique({ where: { id: Number(id) } });
  const categoria = await db.categoria.update({
    where: { id: Number(id) },
    data: { nome, slug: gerarSlug(nome) },
  });
  await registrarLog(
    sessao.nome ?? "?",
    "renomeou categoria",
    `"${anterior?.nome}" -> "${categoria.nome}"`
  );
  return NextResponse.json(categoria);
}

export async function DELETE(_req: Request, contexto: Contexto) {
  const sessao = await exigirAdminApi();
  if (!sessao) {
    return NextResponse.json(
      { erro: "Apenas administradores podem gerenciar categorias." },
      { status: 403 }
    );
  }

  const { id } = await contexto.params;
  const categoria = await db.categoria.delete({ where: { id: Number(id) } });
  await registrarLog(sessao.nome ?? "?", "apagou categoria", `"${categoria.nome}"`);
  return NextResponse.json({ ok: true });
}
