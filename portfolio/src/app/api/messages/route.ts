import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function GET() {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(messages);
  } catch (error) {
    logger.error("messages", "Failed to fetch messages", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}
