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
    const { title, authors, venue, year, abstract: abs, doi, pdfUrl, type, order } = body;
    const publication = await prisma.publication.update({ where: { id }, data: { title, authors, venue, year, abstract: abs, doi, pdfUrl, type, order } });
    return NextResponse.json(publication);
  } catch (error) {
    logger.error("publications", "Failed to update publication", error);
    return NextResponse.json({ error: "Failed to update publication" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const { id } = await params;
    await prisma.publication.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("publications", "Failed to delete publication", error);
    return NextResponse.json({ error: "Failed to delete publication" }, { status: 500 });
  }
}
