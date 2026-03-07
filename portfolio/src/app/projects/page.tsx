import { ProjectsSection } from "@/components/sections";

export const metadata = {
  title: "Projects | Emmanuel Safo Acheampong",
  description: "Explore my research and engineering projects in signal processing, machine learning, computer vision, and more.",
};

export default function ProjectsPage() {
  return (
    <div className="pt-16">
      <ProjectsSection />
    </div>
  );
}
