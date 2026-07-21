// POST /api/admin/upload — recebe a foto do produto (multipart/form-data,
// campo "arquivo") e salva em public/uploads. Retorna { url } para
// guardar no cadastro do produto.
//
// OBS: as fotos ficam no disco do servidor. Se um dia o deploy for para
// um serviço sem disco persistente (ex.: Vercel), este é o ÚNICO arquivo
// que precisa mudar (trocar por S3, Cloudinary etc.).
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { exigirSessaoApi } from "@/lib/sessao";

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

  // Nome aleatório para evitar conflitos e caracteres problemáticos
  const nomeArquivo = crypto.randomUUID() + extensao;
  const pasta = path.join(process.cwd(), "public", "uploads");
  await mkdir(pasta, { recursive: true });
  await writeFile(path.join(pasta, nomeArquivo), Buffer.from(await arquivo.arrayBuffer()));

  return NextResponse.json({ url: `/uploads/${nomeArquivo}` }, { status: 201 });
}
