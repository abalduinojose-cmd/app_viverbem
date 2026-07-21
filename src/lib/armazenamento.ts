// Armazenamento das fotos enviadas pelo painel.
//
// Funciona em dois cenários, escolhido automaticamente:
//
// 1. LOCAL / servidor próprio (sem BLOB_READ_WRITE_TOKEN)
//    Grava em public/uploads/ — como sempre funcionou.
//
// 2. NUVEM serverless, ex.: Vercel (com BLOB_READ_WRITE_TOKEN)
//    Grava no Vercel Blob, porque em serverless o disco é
//    temporário e as fotos se perderiam a cada deploy.
//
// Para trocar por S3/Cloudinary no futuro, basta reescrever a
// função salvarImagem() — nada mais no projeto precisa mudar.

import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

/** true quando estamos num ambiente com Vercel Blob configurado. */
export function usandoNuvem(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

/**
 * Salva a imagem e devolve a URL pública para guardar no produto.
 * @param arquivo arquivo recebido do formulário
 * @param extensao extensão já validada (ex.: ".jpg")
 */
export async function salvarImagem(arquivo: File, extensao: string): Promise<string> {
  // Nome aleatório evita conflitos e caracteres problemáticos
  const nomeArquivo = crypto.randomUUID() + extensao;

  if (usandoNuvem()) {
    // Import dinâmico: só carrega a biblioteca quando realmente for usada
    const { put } = await import("@vercel/blob");
    const { url } = await put(`uploads/${nomeArquivo}`, arquivo, {
      access: "public",
      contentType: arquivo.type,
    });
    return url;
  }

  const pasta = path.join(process.cwd(), "public", "uploads");
  await mkdir(pasta, { recursive: true });
  await writeFile(path.join(pasta, nomeArquivo), Buffer.from(await arquivo.arrayBuffer()));
  return `/uploads/${nomeArquivo}`;
}
