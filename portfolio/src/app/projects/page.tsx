import { ProjectsSection } from "@/components/sections";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Projects | Emmanuel Safo Acheampong",
  description: "Explore my research and engineering projects in signal processing, machine learning, computer vision, and more.",
};

export default async function ProjectsPage() {
  let projects: Awaited<ReturnType<typeof prisma.project.findMany>> = [];
  try {
    projects = await prisma.project.findMany({ orderBy: { order: "asc" } });
  } catch { /* empty */ }

  return (
    <div className="pt-16">
      <ProjectsSection data={projects} />
    </div>
  );
}
