import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    const publications = await prisma.publication.findMany({
      orderBy: [{ order: "asc" }, { year: "desc" }],
    });
    return NextResponse.json(publications);
  } catch (error) {
    logger.error("publications", "Failed to fetch publications", error);
    return NextResponse.json({ error: "Failed to fetch publications" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const body = await request.json();
    const { title, authors, venue, year, abstract: abs, doi, pdfUrl, type, order } = body;

    if (!title || !authors || !venue || !year || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const publication = await prisma.publication.create({
      data: { title, authors, venue, year, abstract: abs, doi, pdfUrl, type, order: order || 0 },
    });
    return NextResponse.json(publication, { status: 201 });
  } catch (error) {
    logger.error("publications", "Failed to create publication", error);
    return NextResponse.json({ error: "Failed to create publication" }, { status: 500 });
  }
}
