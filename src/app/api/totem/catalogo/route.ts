// GET /api/totem/catalogo — catálogo público consumido pelo totem.
// Usa a MESMA consulta da página do catálogo (src/lib/catalogo.ts).
// Esta rota já deixa pronta a base para o modo offline da Fase 3:
// o tablet poderá baixar este JSON e guardar em cache local.
import { NextResponse } from "next/server";
import { obterCatalogo } from "@/lib/catalogo";

export const dynamic = "force-dynamic";

export async function GET() {
  const catalogo = await obterCatalogo();
  return NextResponse.json(catalogo);
}
