import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: [{ order: "asc" }, { startDate: "desc" }],
    });
    return NextResponse.json(experiences);
  } catch (error) {
    console.error("Failed to fetch experiences:", error);
    return NextResponse.json({ error: "Failed to fetch experiences" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, company, location, description, startDate, endDate, current, type, order } = body;

    if (!title || !company || !description || !type || !startDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const experience = await prisma.experience.create({
      data: { title, company, location, description, startDate: new Date(startDate), endDate: endDate ? new Date(endDate) : null, current: current || false, type, order: order || 0 },
    });
    return NextResponse.json(experience, { status: 201 });
  } catch (error) {
    console.error("Failed to create experience:", error);
    return NextResponse.json({ error: "Failed to create experience" }, { status: 500 });
  }
}
