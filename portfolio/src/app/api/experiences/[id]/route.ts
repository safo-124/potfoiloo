import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, company, location, description, startDate, endDate, current, type, order } = body;
    const experience = await prisma.experience.update({
      where: { id },
      data: {
        title, company, location, description, current, type, order,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : null,
      },
    });
    return NextResponse.json(experience);
  } catch (error) {
    console.error("Failed to update experience:", error);
    return NextResponse.json({ error: "Failed to update experience" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.experience.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete experience:", error);
    return NextResponse.json({ error: "Failed to delete experience" }, { status: 500 });
  }
}
