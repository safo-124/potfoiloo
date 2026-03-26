import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function GET() {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const [projects, blogPosts, publications, messages] = await Promise.all([
      prisma.project.count(),
      prisma.blogPost.count(),
      prisma.publication.count(),
      prisma.contactMessage.count(),
    ]);
    return NextResponse.json({ projects, blogPosts, publications, messages });
  } catch (error) {
    logger.error("stats", "Failed to fetch stats", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
