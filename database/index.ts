import { PrismaClient } from "./prisma/generated/client";

// This type allows us to add prisma to the global scope
declare global {
  var prisma: PrismaClient | undefined;
}

function createPrismaClient() {
  return new PrismaClient({
    log: ["query", "info", "warn", "error"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
}

// In development, we want to use a single instance across hot reloads
// In production, we want to create a new instance for each request
export const prisma = global.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

// Export a function to get the client that's safe for both static and dynamic contexts
export function getPrismaClient() {
  if (process.env.NODE_ENV === "production") {
    // In production, create a new client for each request
    return createPrismaClient();
  }
  // In development, reuse the global instance
  return prisma;
}

// Utility function to check if we're in a static context
export function isStaticContext() {
  return process.env.NEXT_PHASE === "phase-production-build";
}

// Export a helper for route configuration
export const DATABASE_ROUTE_CONFIG = {
  dynamic: "force-dynamic" as const,
  fetchCache: "force-no-store" as const,
};

// Helper function to safely execute database operations
export async function withDatabase<T>(
  operation: (db: PrismaClient) => Promise<T>
): Promise<T> {
  const db = getPrismaClient();
  try {
    return await operation(db);
  } catch (error) {
    console.error("Database operation failed:", error);
    throw error;
  }
}
