import { prisma } from "@/lib/prisma";
import { CVDocument } from "@/components/cv-document";

export const revalidate = 30;

export const metadata = {
  title: "CV — Emmanuel Safo Acheampong",
};

export default async function CVPage() {
  const [settings, experiences, skills, publications, projects] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "main" } }).catch(() => null),
    prisma.experience.findMany({ orderBy: { startDate: "desc" } }).catch(() => []),
    prisma.skill.findMany({ orderBy: { order: "asc" } }).catch(() => []),
    prisma.publication.findMany({ orderBy: { year: "desc" } }).catch(() => []),
    prisma.project.findMany({ where: { featured: true }, orderBy: { order: "asc" }, take: 5 }).catch(() => []),
  ]);

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
