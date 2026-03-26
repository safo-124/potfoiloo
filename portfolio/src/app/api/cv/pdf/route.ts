import { NextRequest, NextResponse } from "next/server";
import { createCvPdfBuffer, CvSkillsByCategory } from "@/lib/cv-pdf";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function parseDevice(ua: string): string {
  if (/mobile|android|iphone|ipod/i.test(ua)) return "mobile";
  if (/ipad|tablet/i.test(ua)) return "tablet";
  return "desktop";
}

function parseBrowser(ua: string): string {
  if (/edg\//i.test(ua)) return "Edge";
  if (/chrome|crios/i.test(ua)) return "Chrome";
  if (/firefox|fxios/i.test(ua)) return "Firefox";
  if (/safari/i.test(ua) && !/chrome/i.test(ua)) return "Safari";
  if (/opera|opr/i.test(ua)) return "Opera";
  return "Other";
}

function parseOS(ua: string): string {
  if (/windows/i.test(ua)) return "Windows";
  if (/mac os|macintosh/i.test(ua)) return "macOS";
  if (/linux/i.test(ua) && !/android/i.test(ua)) return "Linux";
  if (/android/i.test(ua)) return "Android";
  if (/iphone|ipad|ipod/i.test(ua)) return "iOS";
  return "Other";
}

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

async function fetchJSON<T>(base: string, path: string): Promise<T> {
  const res = await fetch(`${base}${path}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${path}: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function GET(request: NextRequest) {
  try {
    // Track the download
    const ua = request.headers.get("user-agent") || "";
    const country = request.headers.get("x-vercel-ip-country") || null;
    const referrer = request.headers.get("referer")?.slice(0, 1000) || null;
    prisma.cvDownload.create({
      data: {
        userAgent: ua.slice(0, 500),
        device: parseDevice(ua),
        browser: parseBrowser(ua),
        os: parseOS(ua),
        country,
        referrer,
      },
    }).catch((err: unknown) => logger.error("cv", "Failed to track CV download", err));

    const origin = new URL(request.url).origin;
    const [settings, experiences, skills, publications] = await Promise.all([
      fetchJSON<ApiSettings>(origin, "/api/settings"),
      fetchJSON<ApiExperience[]>(origin, "/api/experiences"),
      fetchJSON<ApiSkill[]>(origin, "/api/skills"),
      fetchJSON<ApiPublication[]>(origin, "/api/publications"),
    ]);

    let projects: ApiProject[] = [];
    try {
      projects = await fetchJSON<ApiProject[]>(origin, "/api/projects");
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
    logger.error("cv", "Failed to generate CV PDF", error);
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
