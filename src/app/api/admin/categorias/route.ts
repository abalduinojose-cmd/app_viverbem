// POST /api/admin/categorias — cria uma categoria.
// Permissão: SOMENTE ADMIN (operador não gerencia categorias).
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { exigirAdminApi } from "@/lib/sessao";
import { gerarSlug } from "@/lib/slug";
import { registrarLog } from "@/lib/log";

export async function POST(req: Request) {
  const sessao = await exigirAdminApi();
  if (!sessao) {
    return NextResponse.json(
      { erro: "Apenas administradores podem gerenciar categorias." },
      { status: 403 }
    );
  }

  const corpo = await req.json().catch(() => ({}));
  const nome = String(corpo.nome ?? "").trim();
  if (!nome) {
    return NextResponse.json({ erro: "Informe o nome da categoria." }, { status: 400 });
  }

  const slug = gerarSlug(nome);
  const jaExiste = await db.categoria.findUnique({ where: { slug } });
  if (jaExiste) {
    return NextResponse.json({ erro: "Já existe uma categoria com esse nome." }, { status: 409 });
  }

  // Nova categoria entra no final da lista
  const ultima = await db.categoria.findFirst({ orderBy: { ordem: "desc" } });
  const categoria = await db.categoria.create({
    data: { nome, slug, ordem: (ultima?.ordem ?? -1) + 1 },
  });
  await registrarLog(sessao.nome ?? "?", "criou categoria", `"${categoria.nome}"`);
  return NextResponse.json(categoria, { status: 201 });
}
