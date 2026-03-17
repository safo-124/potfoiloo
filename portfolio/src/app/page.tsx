import { HeroSection } from "@/components/sections";
import { HomePreview } from "@/components/home-preview";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  let featuredProjects, projectCount, pubCount;
  try {
    featuredProjects = await prisma.project.findMany({ where: { featured: true }, orderBy: { order: "asc" }, take: 3 });
  } catch { featuredProjects = []; }
  try {
    projectCount = await prisma.project.count();
    pubCount = await prisma.publication.count();
  } catch { projectCount = 0; pubCount = 0; }

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
