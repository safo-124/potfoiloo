import { AboutSection, ExperienceSection, SkillsSection } from "@/components/sections";

export const metadata = {
  title: "About | Emmanuel Safo Acheampong",
  description: "Learn about Emmanuel Safo Acheampong — Signal Processing & ML Engineer. Education, experience, and technical skills.",
};

export default function AboutPage() {
  return (
    <div className="pt-16">
      <AboutSection />
      <ExperienceSection />
      <SkillsSection />
    </div>
  );
}
