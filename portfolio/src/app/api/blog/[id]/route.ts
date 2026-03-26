import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const { id } = await params;
    const body = await request.json();
    const { title, slug, excerpt, content, coverImage, tags, published } = body;
    const post = await prisma.blogPost.update({ where: { id }, data: { title, slug, excerpt, content, coverImage, tags, published } });
    return NextResponse.json(post);
  } catch (error) {
    logger.error("blog", "Failed to update blog post", error);
    return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const { id } = await params;
    await prisma.blogPost.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("blog", "Failed to delete blog post", error);
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 });
  }
}
