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
