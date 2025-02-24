import * as z from "zod";
import "dotenv/config";

/**
 * Creates and validates environment variables using Zod schema.
 * Throws an error if validation fails, listing missing or invalid variables.
 *
 * @returns {object} - Validated environment variables.
 */
function createEnv(): Record<string, string> {
  const EnvSchema = z.object({
    API_URL: z.string(),
    DB_USER: z.string(),
    DB_PASSWORD: z.string(),
    DATABASE_URL: z.string().url(),
  });

  const envVars = {
    API_URL: process.env.NEXT_PUBLIC_API_URL,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DATABASE_URL: process.env.DATABASE_URL,
  };

  const parsedEnv = EnvSchema.safeParse(envVars);

  if (!parsedEnv.success) {
    throw new Error(
      `Invalid env provided.
  The following variables are missing or invalid:
  ${Object.entries(parsedEnv.error.flatten().fieldErrors)
    .map(([k, v]) => `- ${k}: ${v}`)
    .join("\n")}
  `
    );
  }

  return parsedEnv.data ?? {};
}

export const env = createEnv();
