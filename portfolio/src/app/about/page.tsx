import { AboutSection, ExperienceSection, SkillsSection } from "@/components/sections";
import prisma from "@/lib/prisma";

export const metadata = {
  title: "About | Emmanuel Safo Acheampong",
  description: "Learn about Emmanuel Safo Acheampong — Signal Processing & ML Engineer. Education, experience, and technical skills.",
};

export default async function AboutPage() {
  let experiences, skills;
  try {
    experiences = await prisma.experience.findMany({ orderBy: { order: "asc" } });
  } catch { experiences = []; }
  try {
    skills = await prisma.skill.findMany({ orderBy: { order: "asc" } });
  } catch { skills = []; }

  const experienceData = experiences.map(e => ({
    ...e,
    startDate: e.startDate.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    endDate: e.endDate ? e.endDate.toLocaleDateString("en-US", { month: "short", year: "numeric" }) : undefined,
  }));

  return (
    <div className="pt-16">
      <AboutSection />
      <ExperienceSection data={experienceData} />
      <SkillsSection data={skills} />
    </div>
  );
}
