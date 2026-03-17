import { HeroSection } from "@/components/sections";
import { HomePreview } from "@/components/home-preview";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  let featuredProjects: Awaited<ReturnType<typeof prisma.project.findMany>> = [];
  let projectCount = 0;
  let pubCount = 0;
  try {
    featuredProjects = await prisma.project.findMany({ where: { featured: true }, orderBy: { order: "asc" }, take: 3 });
  } catch { /* empty */ }
  try {
    projectCount = await prisma.project.count();
    pubCount = await prisma.publication.count();
  } catch { /* empty */ }

  const stats = projectCount > 0 ? {
    projects: `${projectCount}+`,
    publications: `${pubCount}`,
    yearsStudy: "6+",
    languages: "8+",
  } : undefined;

  return (
    <>
      <HeroSection />
      <HomePreview
        featuredProjectsData={featuredProjects.length > 0 ? featuredProjects : undefined}
        stats={stats}
      />
    </>
  );
}
