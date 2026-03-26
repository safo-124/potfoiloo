import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: [{ category: "asc" }, { order: "asc" }],
    });
    return NextResponse.json(skills);
  } catch (error) {
    logger.error("skills", "Failed to fetch skills", error);
    return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const body = await request.json();
    const { name, category, level, icon, order } = body;

    if (!name || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const skill = await prisma.skill.create({
      data: { name, category, level: level || 80, icon, order: order || 0 },
    });
    return NextResponse.json(skill, { status: 201 });
  } catch (error) {
    logger.error("skills", "Failed to create skill", error);
    return NextResponse.json({ error: "Failed to create skill" }, { status: 500 });
  }
}
