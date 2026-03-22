"use client";

import { Mail, Github, Linkedin, Globe, Printer, ArrowLeft, Download } from "lucide-react";
import Link from "next/link";

interface Settings {
  name: string;
  title: string;
  tagline: string;
  about?: string | null;
  email?: string | null;
  github?: string | null;
  linkedin?: string | null;
  scholar?: string | null;
  resumeUrl?: string | null;
}

interface Experience {
  id: string;
  title: string;
  company: string;
  location?: string | null;
  description: string;
  startDate: string | Date;
  endDate?: string | Date | null;
  current: boolean;
  type: string;
}

interface Publication {
  id: string;
  title: string;
  authors: string;
  venue: string;
  year: number;
  type: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  demoUrl?: string | null;
  githubUrl?: string | null;
}

interface CVDocumentProps {
  settings: Settings | null;
  education: Experience[];
  work: Experience[];
  skillsByCategory: Record<string, string[]>;
  publications: Publication[];
  projects: Project[];
}

function formatDate(d: string | Date) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function CVDocument({
  settings,
  education,
  work,
  skillsByCategory,
  publications,
  projects,
}: CVDocumentProps) {
  const name = settings?.name || "Emmanuel Safo Acheampong";
  const title = settings?.title || "Signal Processing & ML Engineer";

  return (
    <div className="min-h-screen bg-background">
      {/* Toolbar — hidden when printing */}
      <div data-print-hide className="print:hidden sticky top-0 z-40 bg-background/80 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between max-w-4xl">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to portfolio
          </Link>
          <div className="flex items-center gap-2">
            {settings?.resumeUrl && (
              <a
                href={settings.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border border-border hover:bg-accent transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                Download PDF
              </a>
            )}
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              Print / Save PDF
            </button>
          </div>
        </div>
      </div>

      {/* CV Content */}
      <div className="container mx-auto px-4 py-10 max-w-4xl print:px-0 print:py-0 print:max-w-none">
        <div className="cv-page bg-white text-black rounded-lg shadow-sm border border-border print:rounded-none print:shadow-none print:border-none p-8 sm:p-12 print:p-[1cm]">

          {/* ─── Header ─── */}
          <header className="border-b-2 border-gray-800 pb-4 mb-6">
            <h1 className="text-3xl font-bold tracking-tight">{name}</h1>
            <p className="text-lg text-gray-600 mt-1">{title}</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-sm text-gray-600">
              {settings?.email && (
                <span className="inline-flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  {settings.email}
                </span>
              )}
              {settings?.github && (
                <span className="inline-flex items-center gap-1">
                  <Github className="h-3.5 w-3.5" />
                  {settings.github.replace("https://github.com/", "")}
                </span>
              )}
              {settings?.linkedin && (
                <span className="inline-flex items-center gap-1">
                  <Linkedin className="h-3.5 w-3.5" />
                  {settings.linkedin.replace("https://www.linkedin.com/in/", "").replace("https://linkedin.com/in/", "")}
                </span>
              )}
              {settings?.scholar && (
                <span className="inline-flex items-center gap-1">
                  <Globe className="h-3.5 w-3.5" />
                  Google Scholar
                </span>
              )}
            </div>
          </header>

          {/* ─── Summary ─── */}
          {settings?.about && (
            <section className="mb-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-3">
                Professional Summary
              </h2>
              <p className="text-sm leading-relaxed text-gray-700">
                {settings.about.length > 500
                  ? settings.about.slice(0, 500) + "..."
                  : settings.about}
              </p>
            </section>
          )}

          {/* ─── Work Experience ─── */}
          {work.length > 0 && (
            <section className="mb-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-3">
                Work Experience
              </h2>
              <div className="space-y-4">
                {work.map((w) => (
                  <div key={w.id}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-sm">{w.title}</h3>
                        <p className="text-sm text-gray-600">
                          {w.company}
                          {w.location ? ` — ${w.location}` : ""}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 whitespace-nowrap shrink-0">
                        {formatDate(w.startDate)} — {w.current ? "Present" : w.endDate ? formatDate(w.endDate) : ""}
                      </p>
                    </div>
                    <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                      {w.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ─── Education ─── */}
          {education.length > 0 && (
            <section className="mb-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-3">
                Education
              </h2>
              <div className="space-y-4">
                {education.map((e) => (
                  <div key={e.id}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-sm">{e.title}</h3>
                        <p className="text-sm text-gray-600">
                          {e.company}
                          {e.location ? ` — ${e.location}` : ""}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 whitespace-nowrap shrink-0">
                        {formatDate(e.startDate)} — {e.current ? "Present" : e.endDate ? formatDate(e.endDate) : ""}
                      </p>
                    </div>
                    <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                      {e.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ─── Skills ─── */}
          {Object.keys(skillsByCategory).length > 0 && (
            <section className="mb-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-3">
                Technical Skills
              </h2>
              <div className="space-y-2">
                {Object.entries(skillsByCategory).map(([category, items]) => (
                  <div key={category} className="flex gap-2 text-sm">
                    <span className="font-semibold text-gray-800 shrink-0">{category}:</span>
                    <span className="text-gray-700">{items.join(", ")}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ─── Key Projects ─── */}
          {projects.length > 0 && (
            <section className="mb-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-3">
                Key Projects
              </h2>
              <div className="space-y-3">
                {projects.map((p) => (
                  <div key={p.id}>
                    <div className="flex items-baseline gap-2">
                      <h3 className="font-semibold text-sm">{p.title}</h3>
                      <span className="text-xs text-gray-500">{p.tags.slice(0, 4).join(" · ")}</span>
                    </div>
                    <p className="text-sm text-gray-700 mt-0.5">{p.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ─── Publications ─── */}
          {publications.length > 0 && (
            <section className="mb-2">
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-3">
                Publications
              </h2>
              <div className="space-y-2">
                {publications.map((p) => (
                  <div key={p.id} className="text-sm text-gray-700">
                    <span className="font-semibold">{p.title}</span>
                    {" — "}
                    <span>{p.authors}</span>
                    {". "}
                    <span className="italic">{p.venue}</span>
                    {`, ${p.year}.`}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
