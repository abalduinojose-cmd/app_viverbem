// POST /api/auth/logout — encerra a sessão do painel.
import { NextResponse } from "next/server";
import { obterSessao } from "@/lib/sessao";

export async function POST() {
  const sessao = await obterSessao();
  sessao.destroy();
  return NextResponse.json({ ok: true });
}
