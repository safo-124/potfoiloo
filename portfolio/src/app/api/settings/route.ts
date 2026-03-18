import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let settings = await prisma.siteSettings.findUnique({ where: { id: "main" } });
    if (!settings) {
      settings = await prisma.siteSettings.create({ data: { id: "main" } });
    }
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { name, title, tagline, about, avatarUrl, resumeUrl, email, github, linkedin, scholar, twitter } = body;

    const settings = await prisma.siteSettings.upsert({
      where: { id: "main" },
      update: { name, title, tagline, about, avatarUrl, resumeUrl, email, github, linkedin, scholar, twitter },
      create: { id: "main", name, title, tagline, about, avatarUrl, resumeUrl, email, github, linkedin, scholar, twitter },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Failed to update settings:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
