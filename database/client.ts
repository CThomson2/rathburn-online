import { PrismaClient } from "@/database/prisma/generated/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Log the actual DATABASE_URL for debugging
console.log("Initializing Prisma with DATABASE_URL:", process.env.DATABASE_URL);

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "info", "warn", "error"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
