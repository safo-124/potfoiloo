"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink, Filter } from "lucide-react";

/* ─── 3D Tilt Card Wrapper ─── */
function TiltCard({ children, className, featured }: { children: React.ReactNode; className?: string; featured?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("");
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (0.5 - y) * 12;
    const rotateY = (x - 0.5) * 12;
    setTransform(`perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`);
    setGlare({ x: x * 100, y: y * 100, opacity: 0.15 });
  };
  const handleLeave = () => { setTransform(""); setGlare({ x: 50, y: 50, opacity: 0 }); };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`relative ${featured ? "gradient-border-wrap" : ""} ${className || ""}`}
      style={{ transform, transition: transform ? "transform 0.1s ease-out" : "transform 0.4s ease-out" }}
    >
      {children}
      {/* Glare overlay */}
      <div
        className="pointer-events-none absolute inset-0 rounded-lg z-10"
        style={{
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,${glare.opacity}), transparent 60%)`,
          transition: "opacity 0.2s",
        }}
      />
    </div>
  );
}



/* ─── Browser Frame Preview ─── */
function BrowserFrame({ url, title }: { url: string; title: string }) {
  return (
    <div className="relative w-full overflow-hidden bg-muted/30">
      {/* Browser toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-muted/60 border-b border-border">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
        </div>
        <div className="flex-1 mx-2">
          <div className="bg-background/60 rounded-md px-3 py-0.5 text-[10px] text-muted-foreground truncate font-mono">
            {url.replace(/^https?:\/\//, "")}
          </div>
        </div>
      </div>
      {/* Iframe viewport */}
      <div className="relative w-full" style={{ height: "180px", overflow: "hidden" }}>
        <iframe
          src={url}
          title={`Preview of ${title}`}
          className="absolute top-0 left-0 border-0 pointer-events-none"
          style={{
            width: "1280px",
            height: "800px",
            transform: "scale(0.14)",
            transformOrigin: "top left",
          }}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin"
          tabIndex={-1}
        />
      </div>
    </div>
  );
}



interface ProjectData {
  title: string; slug: string; description: string; tags: string[];
  category: string; featured: boolean; imageUrl?: string | null;
  demoUrl?: string | null; githubUrl?: string | null;
}

export function ProjectsSection({ data }: { data?: ProjectData[] }) {
  const [filter, setFilter] = useState("All");
  const allProjects = data ?? [];
  const categories = ["All", ...Array.from(new Set(allProjects.map(p => p.category)))];

  if (allProjects.length === 0) {
    return (
      <section id="projects" className="py-24 bg-card/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Featured <span className="text-primary">Projects</span>
          </h2>
          <p className="text-muted-foreground">Projects will appear here once added via the admin dashboard.</p>
        </div>
      </section>
    );
  }

  const filteredProjects =
    filter === "All"
      ? allProjects
      : allProjects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="py-24 bg-card/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Featured <span className="text-primary">Projects</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A collection of my research projects and engineering work in signal
            processing and machine learning
          </p>
        </motion.div>

        {/* Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={filter === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(cat)}
              className="rounded-full"
            >
              {cat === "All" && <Filter className="h-3 w-3 mr-1" />}
              {cat}
            </Button>
          ))}
        </motion.div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                layout
              >
                <TiltCard featured={project.featured}>
                <Card className="h-full flex flex-col hover:border-primary/50 transition-all duration-300 group overflow-hidden">
                  {/* Project Preview */}
                  {project.demoUrl ? (
                    <BrowserFrame url={project.demoUrl} title={project.title} />
                  ) : (
                  <div className="relative h-48 bg-gradient-to-br from-primary/5 to-primary/20 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-6xl opacity-20 font-mono font-bold text-primary">
                        {project.title.charAt(0)}
                      </div>
                    </div>
                    {project.featured && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-primary/90 text-primary-foreground">
                          Featured
                        </Badge>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  )}

                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                      {project.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1">
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>

                  <CardFooter className="gap-2">
                    {project.githubUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github className="h-4 w-4 mr-1" />
                          Code
                        </a>
                      </Button>
                    )}
                    {project.demoUrl && (
                      <Button size="sm" asChild>
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Demo
                        </a>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
                </TiltCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
