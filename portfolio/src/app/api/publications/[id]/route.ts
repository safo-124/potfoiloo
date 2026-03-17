import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const publication = await prisma.publication.update({ where: { id }, data: body });
    return NextResponse.json(publication);
  } catch (error) {
    console.error("Failed to update publication:", error);
    return NextResponse.json({ error: "Failed to update publication" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.publication.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete publication:", error);
    return NextResponse.json({ error: "Failed to delete publication" }, { status: 500 });
  }
}
