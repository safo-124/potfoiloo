import { AboutSection, ExperienceSection, SkillsSection } from "@/components/sections";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export const metadata = {
  title: "About | Emmanuel Safo Acheampong",
  description: "Learn about Emmanuel Safo Acheampong — Signal Processing & ML Engineer. Education, experience, and technical skills.",
};

export default async function AboutPage() {
  let experiences: Awaited<ReturnType<typeof prisma.experience.findMany>> = [];
  let skills: Awaited<ReturnType<typeof prisma.skill.findMany>> = [];
  let settings: Awaited<ReturnType<typeof prisma.siteSettings.findUnique>> = null;
  try {
    [experiences, skills, settings] = await Promise.all([
      prisma.experience.findMany({ orderBy: { order: "asc" } }),
      prisma.skill.findMany({ orderBy: { order: "asc" } }),
      prisma.siteSettings.findUnique({ where: { id: "main" } }),
    ]);
  } catch { /* empty */ }

  const experienceData = experiences.map(e => ({
    ...e,
    startDate: e.startDate.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    endDate: e.endDate ? e.endDate.toLocaleDateString("en-US", { month: "short", year: "numeric" }) : undefined,
  }));

  return (
    <div className="pt-16">
      <AboutSection settings={settings ?? undefined} skills={skills} />
      <ExperienceSection data={experienceData} />
      <SkillsSection data={skills} />
    </div>
  );
}
