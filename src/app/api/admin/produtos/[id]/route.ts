// PATCH  /api/admin/produtos/:id — atualiza um produto (edição completa
//        ou parcial: os toggles ativo/novidade/destaque enviam só 1 campo).
//        Permissão: qualquer usuário logado (admin ou operador).
// DELETE /api/admin/produtos/:id — apaga o produto de vez.
//        Permissão: SOMENTE ADMIN (operador não apaga).
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { exigirAdminApi, exigirSessaoApi } from "@/lib/sessao";
import { validarCorpoProduto } from "@/lib/validarProduto";
import { registrarLog } from "@/lib/log";
import { formatarPreco } from "@/lib/preco";

type Contexto = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, contexto: Contexto) {
  const sessao = await exigirSessaoApi();
  if (!sessao) {
    return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });
  }

  const { id } = await contexto.params;
  const corpo = await req.json().catch(() => ({}));

  // Toggles rápidos: se o corpo só tem campos booleanos, atualiza direto
  // sem exigir o produto inteiro (usado pelos botões da listagem)
  const chaves = Object.keys(corpo);
  const soToggles =
    chaves.length > 0 && chaves.every((c) => ["ativo", "novidade", "destaque"].includes(c));

  if (soToggles) {
    const dados: Record<string, boolean> = {};
    for (const c of chaves) dados[c] = corpo[c] === true;
    const produto = await db.produto.update({ where: { id: Number(id) }, data: dados });
    const mudancas = chaves.map((c) => `${c}=${dados[c] ? "sim" : "não"}`).join(", ");
    await registrarLog(sessao.nome ?? "?", "alterou produto", `"${produto.nome}": ${mudancas}`);
    return NextResponse.json(produto);
  }

  // Edição completa (formulário)
  const resultado = validarCorpoProduto(corpo);
  if ("erro" in resultado) {
    return NextResponse.json({ erro: resultado.erro }, { status: 400 });
  }

  const anterior = await db.produto.findUnique({ where: { id: Number(id) } });
  const produto = await db.produto.update({
    where: { id: Number(id) },
    data: resultado.dados,
  });

  // Log com destaque para mudança de preço (a mais sensível)
  const detalhe =
    anterior && anterior.precoCentavos !== produto.precoCentavos
      ? `"${produto.nome}": preço ${formatarPreco(anterior.precoCentavos)} -> ${formatarPreco(produto.precoCentavos)}`
      : `"${produto.nome}"`;
  await registrarLog(sessao.nome ?? "?", "editou produto", detalhe);

  return NextResponse.json(produto);
}

export async function DELETE(_req: Request, contexto: Contexto) {
  const sessao = await exigirAdminApi();
  if (!sessao) {
    return NextResponse.json(
      { erro: "Apenas administradores podem apagar produtos." },
      { status: 403 }
    );
  }

  const { id } = await contexto.params;
  const produto = await db.produto.delete({ where: { id: Number(id) } });
  await registrarLog(sessao.nome ?? "?", "apagou produto", `"${produto.nome}"`);
  return NextResponse.json({ ok: true });
}
