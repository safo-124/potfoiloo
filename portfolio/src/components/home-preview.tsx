"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  Brain,
  Radio,
  Code2,
  Database,
  Briefcase,
  GraduationCap,
  BookOpen,
  Mail,
} from "lucide-react";

/* ─── Animated Counter ─── */
function AnimatedCounter({ value, suffix = "" }: { value: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const num = parseInt(value.replace(/[^0-9]/g, ""), 10);
    if (isNaN(num) || num === 0) { setDisplay(value); return; }
    const hasSuffix = value.includes("+");
    const duration = 1500;
    const steps = 40;
    const stepTime = duration / steps;
    let step = 0;
    const iv = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.round(eased * num);
      setDisplay(current + (hasSuffix ? "+" : ""));
      if (step >= steps) { clearInterval(iv); setDisplay(value); }
    }, stepTime);
    return () => clearInterval(iv);
  }, [inView, value]);

  return <span ref={ref}>{display}{suffix}</span>;
}


const highlights = [
  { icon: Radio, title: "Signal Processing", color: "text-emerald-500" },
  { icon: Brain, title: "Machine Learning", color: "text-emerald-400" },
  { icon: Code2, title: "Software Engineering", color: "text-emerald-600" },
  { icon: Database, title: "Data Analysis", color: "text-emerald-500" },
];

/* ─── Browser Frame Preview ─── */
function BrowserFrame({ url, title }: { url: string; title: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.3);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => setScale(el.offsetWidth / 1280);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-border bg-muted/30 shadow-sm">
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
      {/* Iframe viewport — scales to fill container width */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden"
        style={{ height: `${800 * scale}px` }}
      >
        <iframe
          src={url}
          title={`Preview of ${title}`}
          className="absolute top-0 left-0 border-0 pointer-events-none"
          style={{
            width: "1280px",
            height: "800px",
            transform: `scale(${scale})`,
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

interface HomePreviewProps {
  featuredProjectsData?: { title: string; description: string; tags: string[]; category: string; demoUrl?: string | null }[];
  stats?: { projects: string; publications: string; yearsStudy: string; languages: string };
}

export function HomePreview({ featuredProjectsData, stats: statsData }: HomePreviewProps) {
  const displayProjects = featuredProjectsData ?? [];
  return (
    <>
      {/* About Preview */}
      <section className="py-16 sm:py-24 bg-card/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              {/* Profile pic for about preview */}
              <div className="relative w-36 h-36 sm:w-56 sm:h-56 mx-auto lg:mx-0 rounded-2xl overflow-hidden border-2 border-primary/20 shadow-xl mb-6">
                <Image
                  src="/profile_pic.jpg"
                  alt="Emmanuel Safo Acheampong"
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6">
                I&apos;m a Masters graduate in Signal Processing and Machine
                Learning, passionate about transforming raw data into actionable
                intelligence. My work bridges classical DSP with modern deep
                learning.
              </p>
              <Button variant="outline" asChild>
                <Link href="/about">
                  Learn more about me
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              {highlights.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="p-5 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors group text-center"
                >
                  <item.icon className={`h-8 w-8 ${item.color} mx-auto mb-2 group-hover:scale-110 transition-transform`} />
                  <h3 className="font-semibold text-sm">{item.title}</h3>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Preview */}
      {displayProjects.length > 0 && (
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-2">
                Featured <span className="text-primary">Projects</span>
              </h2>
              <p className="text-muted-foreground">
                Highlights from my research and engineering work
              </p>
            </div>
            <Button variant="ghost" className="hidden sm:inline-flex" asChild>
              <Link href="/projects">
                View all
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayProjects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:border-primary/50 transition-all group overflow-hidden">
                  {/* Browser preview or gradient bar */}
                  {project.demoUrl ? (
                    <BrowserFrame url={project.demoUrl} title={project.title} />
                  ) : (
                    <div className="h-3 bg-gradient-to-r from-primary/60 to-primary rounded-t-lg" />
                  )}
                  <CardHeader>
                    <Badge variant="secondary" className="w-fit text-xs mb-2">
                      {project.category}
                    </Badge>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {project.title}
                    </CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8 sm:hidden">
            <Button variant="outline" asChild>
              <Link href="/projects">
                View all projects
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      )}

      {/* Quick Stats / CTA Row */}
      <section className="py-16 sm:py-20 bg-card/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-12 sm:mb-16">
            {[
              { icon: Briefcase, label: "Projects", value: statsData?.projects || "0" },
              { icon: BookOpen, label: "Publications", value: statsData?.publications || "0" },
              { icon: GraduationCap, label: "Years Study", value: statsData?.yearsStudy || "6+" },
              { icon: Code2, label: "Languages", value: statsData?.languages || "8+" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-4 sm:p-6 rounded-lg border border-border bg-card"
              >
                <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary mx-auto mb-1 sm:mb-2" />
                <p className="text-2xl sm:text-3xl font-bold text-primary">
                  <AnimatedCounter value={stat.value} />
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Interested in working together?
            </h2>
            <p className="text-muted-foreground mb-6">
              Whether it&apos;s research collaboration, engineering projects, or
              career opportunities — I&apos;d love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/contact">
                  <Mail className="mr-2 h-4 w-4" />
                  Get in Touch
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/publications">
                  <BookOpen className="mr-2 h-4 w-4" />
                  View Publications
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
