import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getConnectionString(): string {
  const url = process.env.DATABASE_URL ?? "";

  // If the URL is a prisma+postgres:// URL (from `prisma dev`), extract the real postgres URL from the API key
  if (url.startsWith("prisma+postgres://")) {
    try {
      const parsed = new URL(url);
      const apiKey = parsed.searchParams.get("api_key") ?? "";
      const decoded = JSON.parse(Buffer.from(apiKey, "base64url").toString());
      return decoded.databaseUrl as string;
    } catch {
      // Fallback: use the URL as-is
    }
  }

  return url;
}

const adapter = new PrismaPg({ connectionString: getConnectionString() });

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
