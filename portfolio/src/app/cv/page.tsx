import { CVDocument } from "@/components/cv-document";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "CV — Emmanuel Safo Acheampong",
};

async function fetchJSON(path: string) {
  const hdrs = await headers();
  const host = hdrs.get("host") || "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const res = await fetch(`${protocol}://${host}${path}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function CVPage() {
  const [settings, experiences, skills, publications, projects] = await Promise.all([
    fetchJSON("/api/settings"),
    fetchJSON("/api/experiences").then((d) => d || []),
    fetchJSON("/api/skills").then((d) => d || []),
    fetchJSON("/api/publications").then((d) => d || []),
    fetchJSON("/api/projects").then((d) => (d || []).filter((p: { featured: boolean }) => p.featured).slice(0, 5)),
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
