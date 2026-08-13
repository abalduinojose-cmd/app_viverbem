// Tipos compartilhados entre servidor e componentes de cliente.
// (Espelham o schema do Prisma, mas em formato serializável simples.)

export const TIPO_PRODUTO = "PRODUTO";
export const TIPO_COMBO = "COMBO";

export const PAPEL_ADMIN = "ADMIN";
export const PAPEL_OPERADOR = "OPERADOR";

export interface CategoriaDTO {
  id: number;
  nome: string;
  slug: string;
  ordem: number;
}

export interface ProdutoDTO {
  id: number;
  nome: string;
  // Endereço do produto no site (ex.: "omega-3-viver-bem")
  slug: string;
  descricao: string;
  precoCentavos: number;
  tipo: string; // "PRODUTO" | "COMBO"
  fotoUrl: string | null;
  ativo: boolean;
  novidade: boolean;
  destaque: boolean;
  ordem: number;
  categoriaId: number | null;
  categoriaNome?: string | null;
  // Dosagens disponíveis separadas por vírgula (ex.: "250mg, 500mg") ou null
  dosagens: string | null;
  // Campos ricos da página do produto (opcionais)
  composicao: string | null;
  modoUso: string | null;
  indicacoes: string | null;
  apresentacao: string | null;
}

export interface DepoimentoDTO {
  id: number;
  nome: string;
  texto: string;
  nota: number; // estrelas (1 a 5)
  fonte: string; // "Google" | "Loja"
  fotoUrl: string | null; // foto do cliente (opcional)
  ativo: boolean;
  ordem: number;
}

/** Quebra um texto em itens por quebra de linha ou ";".
 *  Não usa vírgula como separador porque ela aparece nos números
 *  (ex.: "Melatonina 0,21mg" precisa ficar em um item só). */
export function listarItens(texto: string | null | undefined): string[] {
  if (!texto) return [];
  return texto
    .split(/[\n;]/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
}

/** "250mg, 500mg" -> ["250mg", "500mg"]; null/vazio -> [] */
export function listarDosagens(dosagens: string | null | undefined): string[] {
  if (!dosagens) return [];
  return dosagens
    .split(",")
    .map((d) => d.trim())
    .filter((d) => d.length > 0);
}

// Contato oficial da loja
export const WHATSAPP_LOJA = "(24) 98873-3934"; // exibição
export const WHATSAPP_NUMERO = "5524988733934"; // formato do link wa.me
export const ANOS_TRADICAO = 19;

export const INSTAGRAM_PERFIL = "manipulacaoviverbem";
export const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_PERFIL}/`;

// Total de avaliações no perfil do Google (o site mostra só uma
// seleção delas). Conferido em ago/2026 — atualize quando crescer.
export const AVALIACOES_GOOGLE_TOTAL = 634;
export const AVALIACOES_GOOGLE_NOTA = 5.0;
export const PERFIL_GOOGLE_URL =
  "https://www.google.com/maps/search/?api=1&query=Viver%20Bem%20-%20Farm%C3%A1cia%20de%20Manipula%C3%A7%C3%A3o&query_place_id=ChIJnz1PkICpmQARI67bD1sFiE8";
