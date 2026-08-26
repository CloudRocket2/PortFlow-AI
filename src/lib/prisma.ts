// =============================================================================
// Prisma Client Singleton — prevents hot-reload from creating multiple clients
// =============================================================================
// Next.js dev server hot-reloads modules, which would create a new PrismaClient
// on every reload and exhaust database connections. This pattern stores the
// client on globalThis so only one instance exists across reloads.
// =============================================================================

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
