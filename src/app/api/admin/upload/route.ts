// POST /api/admin/upload — recebe a foto do produto (multipart/form-data,
// campo "arquivo") e devolve { url } para guardar no cadastro.
//
// O destino da imagem (disco local ou nuvem) é decidido em
// src/lib/armazenamento.ts conforme o ambiente.
import { NextResponse } from "next/server";
import { exigirSessaoApi } from "@/lib/sessao";
import { salvarImagem } from "@/lib/armazenamento";

const TIPOS_PERMITIDOS: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

const TAMANHO_MAXIMO = 8 * 1024 * 1024; // 8 MB

export async function POST(req: Request) {
  if (!(await exigirSessaoApi())) {
    return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });
  }

  const formulario = await req.formData();
  const arquivo = formulario.get("arquivo");

  if (!(arquivo instanceof File)) {
    return NextResponse.json({ erro: "Nenhum arquivo enviado." }, { status: 400 });
  }

  const extensao = TIPOS_PERMITIDOS[arquivo.type];
  if (!extensao) {
    return NextResponse.json(
      { erro: "Formato não suportado. Envie JPG, PNG, WEBP ou GIF." },
      { status: 400 }
    );
  }

  if (arquivo.size > TAMANHO_MAXIMO) {
    return NextResponse.json({ erro: "Arquivo muito grande (máximo 8 MB)." }, { status: 400 });
  }

  const url = await salvarImagem(arquivo, extensao);
  return NextResponse.json({ url }, { status: 201 });
}
