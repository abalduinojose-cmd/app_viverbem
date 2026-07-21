// Instância única do Prisma Client (padrão recomendado para Next.js).
// Em desenvolvimento o hot-reload recriaria o client a cada mudança,
// então guardamos a instância no objeto global para reutilizá-la.
import { PrismaClient } from "@prisma/client";

const globalParaPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db = globalParaPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalParaPrisma.prisma = db;
}
