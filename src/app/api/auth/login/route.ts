// POST /api/auth/login — autentica o usuário do painel.
// Corpo: { email, senha }. Grava a sessão num cookie criptografado.
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { obterSessao } from "@/lib/sessao";

export async function POST(req: Request) {
  const { email, senha } = await req.json().catch(() => ({}));

  if (!email || !senha) {
    return NextResponse.json({ erro: "Informe e-mail e senha." }, { status: 400 });
  }

  const usuario = await db.usuario.findUnique({ where: { email: String(email).toLowerCase() } });

  // Mensagem genérica de propósito: não revela se o e-mail existe
  if (!usuario || !bcrypt.compareSync(String(senha), usuario.senhaHash)) {
    return NextResponse.json({ erro: "E-mail ou senha incorretos." }, { status: 401 });
  }

  const sessao = await obterSessao();
  sessao.usuarioId = usuario.id;
  sessao.nome = usuario.nome;
  sessao.papel = usuario.papel;
  await sessao.save();

  return NextResponse.json({ ok: true, nome: usuario.nome });
}
