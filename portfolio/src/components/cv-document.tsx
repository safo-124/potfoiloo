"use client";

import { Mail, Github, Linkedin, Globe, ArrowLeft, Download } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

interface Settings {
  name: string;
  title: string;
  tagline: string;
  about?: string | null;
  avatarUrl?: string | null;
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
  skillsByCategory: Record<string, { name: string; level: number }[]>;
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
  const cvRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    // For reliability in production, download the curated static PDF.
    // This file lives in public/emmanuel-safo-cv.pdf and should contain
    // the final CV with proper clickable links.
    try {
      setIsDownloading(true);
      const href = settings?.resumeUrl || "/emmanuel-safo-cv.pdf";
      const link = document.createElement("a");
      link.href = href;
      link.download = "emmanuel-safo-cv.pdf";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to start CV download", error);
      alert("Unable to start the download. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24">
      {/* CV Actions Bar */}
      <div data-print-hide className="print:hidden container mx-auto px-4 max-w-4xl mb-6">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to portfolio
          </Link>
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 text-white font-medium text-sm hover:bg-emerald-700 transition-colors cursor-pointer shadow-md"
          >
            <Download className="h-4 w-4" />
            {isDownloading ? "Downloading..." : "Download as PDF"}
          </button>
        </div>
      </div>

      {/* CV Content */}
      <div ref={cvRef} className="container mx-auto px-4 pb-10 max-w-4xl print:px-0 print:py-0 print:max-w-none">
        <div className="cv-page bg-white text-black rounded-lg shadow-sm border border-border print:rounded-none print:shadow-none print:border-none p-8 sm:p-12 print:p-[1cm]">

          {/* ─── Header ─── */}
          <header className="border-b-2 border-gray-800 pb-4 mb-6">
            <div className="flex items-start gap-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={settings?.avatarUrl || "/profile_pic.jpg"}
                alt={name}
                className="w-20 h-20 rounded-full object-cover shrink-0 border-2 border-gray-300 print:w-16 print:h-16"
              />
              <div className="min-w-0">
                <h1 className="text-3xl font-bold tracking-tight">{name}</h1>
                <p className="text-lg text-gray-600 mt-1">{title}</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-sm text-gray-600">
                  {settings?.email && (
                    <a href={`mailto:${settings.email}`} className="inline-flex items-center gap-1 hover:text-gray-900 transition-colors">
                      <Mail className="h-3.5 w-3.5" />
                      {settings.email}
                    </a>
                  )}
                  {settings?.github && (
                    <a href={settings.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-gray-900 transition-colors">
                      <Github className="h-3.5 w-3.5" />
                      {settings.github.replace("https://github.com/", "")}
                    </a>
                  )}
                  {settings?.linkedin && (
                    <a href={settings.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-gray-900 transition-colors">
                      <Linkedin className="h-3.5 w-3.5" />
                      {settings.linkedin.replace("https://www.linkedin.com/in/", "").replace("https://linkedin.com/in/", "")}
                    </a>
                  )}
                  <a href="https://portfoilo-two-ivory.vercel.app" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-gray-900 transition-colors">
                    <Globe className="h-3.5 w-3.5" />
                    portfoilo-two-ivory.vercel.app
                  </a>
                  {settings?.scholar && (
                    <a href={settings.scholar} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-gray-900 transition-colors">
                      <Globe className="h-3.5 w-3.5" />
                      Google Scholar
                    </a>
                  )}
                </div>
              </div>
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

          {/* ─── Skills ─── */}
          {Object.keys(skillsByCategory).length > 0 && (
            <section className="mb-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-4">
                Technical Skills
              </h2>
              <div className="grid grid-cols-2 gap-x-10 gap-y-3">
                {Object.entries(skillsByCategory).map(([category, items]) => (
                  <div key={category}>
                    <h3 className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">{category}</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {items.map((skill) => {
                        const bg = skill.level >= 90
                          ? "bg-gray-800 text-white"
                          : skill.level >= 75
                            ? "bg-gray-200 text-gray-800"
                            : "bg-gray-100 text-gray-600";
                        return (
                          <span
                            key={skill.name}
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${bg} print:border print:border-gray-300`}
                            title={`${skill.level}%`}
                          >
                            {skill.name}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-3 pt-2 border-t border-gray-200">
                <span className="text-[10px] text-gray-400 flex items-center gap-1">
                  <span className="inline-block w-3 h-2 rounded-sm bg-gray-800" /> Expert (90%+)
                </span>
                <span className="text-[10px] text-gray-400 flex items-center gap-1">
                  <span className="inline-block w-3 h-2 rounded-sm bg-gray-200 border border-gray-300" /> Proficient (75-89%)
                </span>
                <span className="text-[10px] text-gray-400 flex items-center gap-1">
                  <span className="inline-block w-3 h-2 rounded-sm bg-gray-100 border border-gray-300" /> Familiar (&#60;75%)
                </span>
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
