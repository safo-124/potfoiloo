import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Calendar,
  Tag,
  Layers,
} from "lucide-react";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let project;
  try {
    project = await prisma.project.findUnique({ where: { slug } });
  } catch {
    project = null;
  }

  if (!project) return notFound();

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Back */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to projects
        </Link>

        {/* Header */}
        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/30 flex items-center gap-1">
              <Layers className="h-3 w-3" />
              {project.category}
            </span>
            {project.featured && (
              <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                Featured
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
            {project.title}
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            {project.description}
          </p>

          {/* Meta row */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground pb-6 border-b border-border flex-wrap">
            <span className="flex items-center gap-1.5 font-mono text-xs">
              <Calendar className="h-3.5 w-3.5" />
              {project.createdAt.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1.5 text-xs">
              <Tag className="h-3.5 w-3.5" />
              {project.tags.length} technologies
            </span>

            {/* Action buttons */}
            <div className="flex items-center gap-2 ml-auto">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border hover:border-primary/50 text-sm font-medium hover:text-primary transition-colors"
                >
                  <Github className="h-4 w-4" />
                  Source Code
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  Live Demo
                </a>
              )}
            </div>
          </div>
        </header>

        {/* Live preview iframe */}
        {project.demoUrl && (
          <section className="mb-10">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="h-5 w-1 bg-primary rounded-full" />
              Live Preview
            </h2>
            <div className="rounded-xl overflow-hidden border border-border bg-muted/30 shadow-sm">
              {/* Browser toolbar */}
              <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/60 border-b border-border">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400/70" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400/70" />
                  <div className="h-3 w-3 rounded-full bg-green-400/70" />
                </div>
                <div className="flex-1 mx-3">
                  <div className="bg-background/60 rounded-md px-3 py-1 text-xs text-muted-foreground truncate font-mono">
                    {project.demoUrl.replace(/^https?:\/\//, "")}
                  </div>
                </div>
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
              {/* Iframe */}
              <div className="relative w-full" style={{ height: "500px" }}>
                <iframe
                  src={project.demoUrl}
                  title={`Preview of ${project.title}`}
                  className="absolute inset-0 w-full h-full border-0"
                  loading="lazy"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            </div>
          </section>
        )}

        {/* Long description */}
        {project.longDescription && (
          <section className="mb-10">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="h-5 w-1 bg-primary rounded-full" />
              About This Project
            </h2>
            <div className="prose-custom text-muted-foreground leading-relaxed whitespace-pre-line">
              {project.longDescription}
            </div>
          </section>
        )}

        {/* Tech stack */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="h-5 w-1 bg-primary rounded-full" />
            Tech Stack
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium border border-border"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* Footer nav */}
        <footer className="pt-8 border-t border-border">
          <Link
            href="/projects"
            className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            All projects
          </Link>
        </footer>
      </div>
    </div>
  );
}
