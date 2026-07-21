// POST /api/admin/produtos — cria um produto.
// Permissão: qualquer usuário logado (admin ou operador).
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { exigirSessaoApi } from "@/lib/sessao";
import { validarCorpoProduto } from "@/lib/validarProduto";
import { registrarLog } from "@/lib/log";
import { formatarPreco } from "@/lib/preco";

export async function POST(req: Request) {
  const sessao = await exigirSessaoApi();
  if (!sessao) {
    return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });
  }

  const corpo = await req.json().catch(() => ({}));
  const resultado = validarCorpoProduto(corpo);
  if ("erro" in resultado) {
    return NextResponse.json({ erro: resultado.erro }, { status: 400 });
  }

  const produto = await db.produto.create({ data: resultado.dados });
  await registrarLog(
    sessao.nome ?? "?",
    "criou produto",
    `"${produto.nome}" (${formatarPreco(produto.precoCentavos)})`
  );
  return NextResponse.json(produto, { status: 201 });
}
