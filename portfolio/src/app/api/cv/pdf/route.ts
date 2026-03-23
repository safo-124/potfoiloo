import { NextResponse } from "next/server";
import { createCvPdfBuffer, CvSkillsByCategory } from "@/lib/cv-pdf";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface ApiSettings {
  name: string;
  title: string;
  tagline?: string | null;
  about?: string | null;
  avatarUrl?: string | null;
  email?: string | null;
  github?: string | null;
  linkedin?: string | null;
  scholar?: string | null;
}

interface ApiExperience {
  id: string;
  title: string;
  company: string;
  location?: string | null;
  description: string;
  startDate: string;
  endDate?: string | null;
  current: boolean;
  type: string;
}

interface ApiSkill {
  id: string;
  name: string;
  category: string;
  level: number;
}

interface ApiPublication {
  id: string;
  title: string;
  authors: string;
  venue: string;
  year: number;
}

interface ApiProject {
  id: string;
  title: string;
  description: string;
  tags: string[];
  featured: boolean;
}

async function fetchJSON<T>(path: string): Promise<T> {
  const base = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";
  const res = await fetch(`${base}${path}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${path}: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function GET() {
  try {
    const [settings, experiences, skills, publications] = await Promise.all([
      fetchJSON<ApiSettings>("/api/settings"),
      fetchJSON<ApiExperience[]>("/api/experiences"),
      fetchJSON<ApiSkill[]>("/api/skills"),
      fetchJSON<ApiPublication[]>("/api/publications"),
    ]);

    let projects: ApiProject[] = [];
    try {
      projects = await fetchJSON<ApiProject[]>("/api/projects");
    } catch (err) {
      console.error("Failed to fetch projects for CV PDF (continuing without projects):", err);
    }

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
        startDate: String(e.startDate),
        endDate: e.endDate ? String(e.endDate) : null,
        current: e.current,
      })),
      work: work.map((w) => ({
        id: w.id,
        title: w.title,
        company: w.company,
        location: w.location,
        description: w.description,
        startDate: String(w.startDate),
        endDate: w.endDate ? String(w.endDate) : null,
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
