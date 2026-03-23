import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createCvPdfBuffer, CvSkillsByCategory } from "@/lib/cv-pdf";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [settings, experiences, skills, publications, projects] = await Promise.all([
      prisma.siteSettings.findUnique({ where: { id: "main" } }),
      prisma.experience.findMany({ orderBy: [{ order: "asc" }, { startDate: "desc" }] }),
      prisma.skill.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] }),
      prisma.publication.findMany({ orderBy: [{ order: "asc" }, { year: "desc" }] }),
      prisma.project.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] }),
    ]);

    if (!settings) {
      return NextResponse.json({ error: "Site settings not found" }, { status: 500 });
    }

    const education = experiences.filter((e) => e.type === "education");
    const work = experiences.filter((e) => e.type === "work" || e.type === "research");

    const skillsByCategory: CvSkillsByCategory = {};
    for (const s of skills) {
      if (!skillsByCategory[s.category]) skillsByCategory[s.category] = [];
      skillsByCategory[s.category].push({ name: s.name, level: s.level ?? 80 });
    }

    const featuredProjects = projects.filter((p) => p.featured).slice(0, 5).map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      tags: p.tags ?? [],
    }));

    const pdfBuffer = await createCvPdfBuffer({
      settings: {
        name: settings.name || "",
        title: settings.title || "",
        about: settings.about,
        email: settings.email,
        github: settings.github,
        linkedin: settings.linkedin,
        website: "https://portfoilo-two-ivory.vercel.app",
      },
      education: education.map((e) => ({
        id: e.id,
        title: e.title,
        company: e.company,
        location: e.location,
        description: e.description,
        startDate: e.startDate instanceof Date ? e.startDate.toISOString() : String(e.startDate),
        endDate: e.endDate instanceof Date || e.endDate === null ? e.endDate?.toISOString() ?? null : String(e.endDate),
        current: e.current,
      })),
      work: work.map((w) => ({
        id: w.id,
        title: w.title,
        company: w.company,
        location: w.location,
        description: w.description,
        startDate: w.startDate instanceof Date ? w.startDate.toISOString() : String(w.startDate),
        endDate: w.endDate instanceof Date || w.endDate === null ? w.endDate?.toISOString() ?? null : String(w.endDate),
        current: w.current,
      })),
      skillsByCategory,
      publications: publications.map((p) => ({
        id: p.id,
        title: p.title,
        authors: p.authors,
        venue: p.venue,
        year: p.year,
      })),
      projects: featuredProjects,
    });

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=\"emmanuel-safo-cv.pdf\"",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Failed to generate CV PDF:", error);
    const err = error as Error;
    return NextResponse.json(
      {
        error: "Failed to generate CV PDF",
        message: err.message,
        stack: err.stack,
      },
      { status: 500 },
    );
  }
}
