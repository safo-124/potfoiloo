import { prisma } from "@/lib/prisma";
import { CVDocument } from "@/components/cv-document";

export const revalidate = 60;

export const metadata = {
  title: "CV — Emmanuel Safo Acheampong",
};

export default async function CVPage() {
  let settings: Awaited<ReturnType<typeof prisma.siteSettings.findUnique>> = null;
  let experiences: Awaited<ReturnType<typeof prisma.experience.findMany>> = [];
  let skills: Awaited<ReturnType<typeof prisma.skill.findMany>> = [];
  let publications: Awaited<ReturnType<typeof prisma.publication.findMany>> = [];
  let projects: Awaited<ReturnType<typeof prisma.project.findMany>> = [];

  try {
    [settings, experiences, skills, publications, projects] = await Promise.all([
      prisma.siteSettings.findUnique({ where: { id: "main" } }),
      prisma.experience.findMany({ orderBy: { startDate: "desc" } }),
      prisma.skill.findMany({ orderBy: { order: "asc" } }),
      prisma.publication.findMany({ orderBy: { year: "desc" } }),
      prisma.project.findMany({ where: { featured: true }, orderBy: { order: "asc" }, take: 5 }),
    ]);
  } catch {
    /* empty */
  }

  const education = experiences.filter((e) => e.type === "education");
  const work = experiences.filter((e) => e.type === "work" || e.type === "research");

  const skillsByCategory: Record<string, { name: string; level: number }[]> = {};
  for (const s of skills) {
    if (!skillsByCategory[s.category]) skillsByCategory[s.category] = [];
    skillsByCategory[s.category].push({ name: s.name, level: s.level });
  }

  return (
    <CVDocument
      settings={settings}
      education={education}
      work={work}
      skillsByCategory={skillsByCategory}
      publications={publications}
      projects={projects}
    />
  );
}
