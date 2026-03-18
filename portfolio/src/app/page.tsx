import { HeroSection } from "@/components/sections";
import { HomePreview } from "@/components/home-preview";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function Home() {
  let featuredProjects: Awaited<ReturnType<typeof prisma.project.findMany>> = [];
  let projectCount = 0;
  let pubCount = 0;
  let settings: Awaited<ReturnType<typeof prisma.siteSettings.findUnique>> = null;
  try {
    [featuredProjects, projectCount, pubCount, settings] = await Promise.all([
      prisma.project.findMany({ where: { featured: true }, orderBy: { order: "asc" }, take: 3 }),
      prisma.project.count(),
      prisma.publication.count(),
      prisma.siteSettings.findUnique({ where: { id: "main" } }),
    ]);
  } catch { /* empty */ }

  const stats = {
    projects: `${projectCount}+`,
    publications: `${pubCount}`,
    yearsStudy: "6+",
    languages: "8+",
  };

  return (
    <>
      <HeroSection settings={settings ?? undefined} />
      <HomePreview
        featuredProjectsData={featuredProjects.length > 0 ? featuredProjects : undefined}
        stats={stats}
      />
    </>
  );
}
