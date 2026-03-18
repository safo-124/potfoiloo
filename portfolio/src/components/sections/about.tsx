"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Brain, Radio, Code2, Database, Download, MapPin } from "lucide-react";

const highlights = [
  {
    icon: Radio,
    title: "Signal Processing",
    description:
      "Expert in DSP, adaptive filtering, spectral analysis, and wavelet transforms for real-world signal applications.",
    accent: "from-emerald-500/20 to-teal-500/20",
    iconBg: "bg-emerald-500/10 text-emerald-500",
  },
  {
    icon: Brain,
    title: "Machine Learning",
    description:
      "Proficient in deep learning, neural networks, and statistical modeling for classification, regression, and generation tasks.",
    accent: "from-blue-500/20 to-indigo-500/20",
    iconBg: "bg-blue-500/10 text-blue-500",
  },
  {
    icon: Code2,
    title: "Software Engineering",
    description:
      "Building production-quality code in Python, MATLAB, C++, and modern web technologies.",
    accent: "from-violet-500/20 to-purple-500/20",
    iconBg: "bg-violet-500/10 text-violet-500",
  },
  {
    icon: Database,
    title: "Data Analysis",
    description:
      "Experienced in processing large-scale datasets, feature engineering, and building end-to-end ML pipelines.",
    accent: "from-amber-500/20 to-orange-500/20",
    iconBg: "bg-amber-500/10 text-amber-500",
  },
];

interface SiteSettingsData {
  name?: string | null;
  title?: string | null;
  about?: string | null;
  avatarUrl?: string | null;
  resumeUrl?: string | null;
  location?: string | null;
}

interface AboutProps {
  settings?: SiteSettingsData;
  skills?: { name: string; category: string }[];
}

export function AboutSection({ settings, skills }: AboutProps) {
  const techStack =
    skills && skills.length > 0
      ? Array.from(new Set(skills.map((s) => s.name)))
      : [];

  return (
    <section id="about" className="py-16 md:py-24 bg-card/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            About <span className="text-primary">Me</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A passionate engineer at the intersection of signal theory and
            artificial intelligence
          </p>
        </motion.div>

        {/* ── Profile hero card ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative rounded-2xl border border-border bg-card overflow-hidden mb-12 md:mb-16"
        >
          {/* Subtle gradient background */}
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />

          <div className="relative flex flex-col md:flex-row items-center gap-6 md:gap-10 p-6 sm:p-8 md:p-10">
            {/* Profile picture with gradient ring */}
            <div className="relative shrink-0">
              <div className="about-avatar-ring relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-2xl">
                <div className="absolute inset-0.75 rounded-2xl overflow-hidden bg-card z-10">
                  <Image
                    src={settings?.avatarUrl || "/profile_pic.jpg"}
                    alt={settings?.name || "Emmanuel Safo Acheampong"}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              {/* Online dot */}
              <div className="absolute -bottom-1 -right-1 z-20 flex items-center gap-1.5 bg-card border border-border rounded-full px-2.5 py-1 shadow-lg">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="text-[10px] font-medium text-muted-foreground">
                  Open to work
                </span>
              </div>
            </div>

            {/* Name + title + bio */}
            <div className="text-center md:text-left flex-1 min-w-0">
              <h3 className="text-2xl sm:text-3xl font-bold mb-1">
                {settings?.name || "Emmanuel Safo Acheampong"}
              </h3>
              <p className="text-primary font-medium mb-1">
                {settings?.title || "Signal Processing & ML Engineer"}
              </p>
              {settings?.location && (
                <p className="text-sm text-muted-foreground flex items-center justify-center md:justify-start gap-1 mb-4">
                  <MapPin className="h-3.5 w-3.5" />
                  {settings.location}
                </p>
              )}
              {!settings?.location && <div className="mb-4" />}

              <div className="text-muted-foreground leading-relaxed text-sm sm:text-base space-y-3">
                {settings?.about ? (
                  settings.about
                    .split("\n\n")
                    .slice(0, 2)
                    .map((paragraph, i) => <p key={i}>{paragraph}</p>)
                ) : (
                  <>
                    <p>
                      I am a Masters graduate in Signal Processing and Machine
                      Learning with a deep passion for transforming raw data
                      into actionable intelligence. My research bridges
                      classical signal processing techniques with modern deep
                      learning approaches.
                    </p>
                    <p>
                      I&apos;m passionate about building systems that listen,
                      see, and understand — turning signals into insights that
                      make a real difference.
                    </p>
                  </>
                )}
              </div>

              {settings?.resumeUrl && (
                <a
                  href={settings.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <Download className="h-4 w-4" />
                  Download Resume
                </a>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── Highlight cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-12 md:mb-16">
          {highlights.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative rounded-xl border border-border bg-card overflow-hidden hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
            >
              {/* Top gradient accent strip */}
              <div
                className={`h-1 bg-linear-to-r ${item.accent}`}
              />
              <div className="p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <div
                    className={`shrink-0 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${item.iconBg} transition-transform group-hover:scale-110`}
                  >
                    <item.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Tech Stack marquee ── */}
        {techStack.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 text-center">
              Technologies I Work With
            </h3>
            {/* Row 1 */}
            <div className="relative mb-3 overflow-hidden mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
              <div className="marquee-track">
                {[...techStack, ...techStack].map((tech, i) => (
                  <span
                    key={`a-${i}`}
                    className="mx-2 whitespace-nowrap text-sm px-3 py-1.5 rounded-lg border border-border bg-card/80 text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            {/* Row 2 — reverse */}
            {techStack.length > 6 && (
              <div className="relative overflow-hidden mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
                <div className="marquee-track-reverse">
                  {[...techStack.slice().reverse(), ...techStack.slice().reverse()].map((tech, i) => (
                    <span
                      key={`b-${i}`}
                      className="mx-2 whitespace-nowrap text-sm px-3 py-1.5 rounded-lg border border-border bg-card/80 text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
