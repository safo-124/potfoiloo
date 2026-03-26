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
    const { title, slug, description, longDescription, imageUrl, demoUrl, githubUrl, tags, category, featured, order } = body;
    const project = await prisma.project.update({
      where: { id },
      data: { title, slug, description, longDescription, imageUrl, demoUrl, githubUrl, tags, category, featured, order },
    });
    return NextResponse.json(project);
  } catch (error) {
    logger.error("projects", "Failed to update project", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const { id } = await params;
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("projects", "Failed to delete project", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
