"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Briefcase,
  FlaskConical,
  MapPin,
  Calendar,
  ChevronRight,
} from "lucide-react";

const typeIcons = {
  education: GraduationCap,
  work: Briefcase,
  research: FlaskConical,
};

const typeAccent: Record<string, { bg: string; text: string; border: string; dot: string; gradient: string }> = {
  education: {
    bg: "bg-blue-500/10",
    text: "text-blue-500",
    border: "border-blue-500/30",
    dot: "bg-blue-500",
    gradient: "from-blue-500/20 to-transparent",
  },
  work: {
    bg: "bg-primary/10",
    text: "text-primary",
    border: "border-primary/30",
    dot: "bg-primary",
    gradient: "from-primary/20 to-transparent",
  },
  research: {
    bg: "bg-purple-500/10",
    text: "text-purple-500",
    border: "border-purple-500/30",
    dot: "bg-purple-500",
    gradient: "from-purple-500/20 to-transparent",
  },
};

interface ExperienceData {
  type: string;
  title: string;
  company: string;
  location?: string | null;
  startDate: string;
  endDate?: string | null;
  current: boolean;
  description: string;
  highlights?: string[];
}

export function ExperienceSection({ data }: { data?: ExperienceData[] }) {
  const allExperiences = data ?? [];
  const [activeTab, setActiveTab] = useState<"all" | "work" | "education">("all");

  if (allExperiences.length === 0) {
    return (
      <section id="experience" className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Experience & <span className="text-primary">Education</span>
          </h2>
          <p className="text-muted-foreground">
            Experience will appear here once added via the admin dashboard.
          </p>
        </div>
      </section>
    );
  }

  const filtered =
    activeTab === "all"
      ? allExperiences
      : allExperiences.filter((e) => e.type === activeTab);

  const tabs: { key: "all" | "work" | "education"; label: string; icon: typeof Briefcase }[] = [
    { key: "all", label: "All", icon: ChevronRight },
    { key: "work", label: "Work", icon: Briefcase },
    { key: "education", label: "Education", icon: GraduationCap },
  ];

  return (
    <section id="experience" className="py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Experience & <span className="text-primary">Education</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            My professional journey and academic background in engineering,
            signal processing, and software development
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex justify-center gap-2 mb-10">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                activeTab === tab.key
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[19px] md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px bg-border" />

          <AnimatePresence mode="popLayout">
            {filtered.map((exp, index) => {
              const Icon =
                typeIcons[exp.type as keyof typeof typeIcons] || Briefcase;
              const accent =
                typeAccent[exp.type as keyof typeof typeAccent] ||
                typeAccent.work;
              const isRight = index % 2 !== 0;

              return (
                <motion.div
                  key={`${exp.type}-${exp.title}-${index}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className={`relative flex items-start mb-8 md:mb-10 ${
                    isRight
                      ? "md:flex-row-reverse"
                      : "md:flex-row"
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-[19px] md:left-1/2 -translate-x-1/2 z-10">
                    <div
                      className={`flex items-center justify-center w-[38px] h-[38px] md:w-11 md:h-11 rounded-full border-2 ${accent.bg} ${accent.border} bg-card shadow-sm`}
                    >
                      <Icon className={`h-4 w-4 md:h-5 md:w-5 ${accent.text}`} />
                    </div>
                  </div>

                  {/* Card */}
                  <div
                    className={`ml-14 md:ml-0 md:w-[calc(50%-2rem)] ${
                      isRight ? "md:pl-0 md:pr-10" : "md:pr-0 md:pl-10"
                    }`}
                    style={{ marginLeft: undefined }}
                  >
                    <div
                      className={`relative p-5 md:p-6 rounded-xl border border-border bg-card hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 overflow-hidden group ml-14 md:ml-0`}
                    >
                      {/* Gradient accent bar */}
                      <div
                        className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${accent.gradient}`}
                      />

                      {/* Header row: badge + date */}
                      <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                        <span
                          className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${accent.bg} ${accent.text} ${accent.border} border`}
                        >
                          {exp.type}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
                          <Calendar className="h-3 w-3" />
                          {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-bold text-base md:text-lg leading-snug mb-1.5 group-hover:text-primary transition-colors">
                        {exp.title}
                      </h3>

                      {/* Company & location */}
                      <div className="flex items-center gap-3 text-sm mb-3 flex-wrap">
                        <span className={`font-medium ${accent.text}`}>
                          {exp.company}
                        </span>
                        {exp.location && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {exp.location}
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {exp.description}
                      </p>

                      {/* Highlights */}
                      {exp.highlights && exp.highlights.length > 0 && (
                        <ul className="mt-3 space-y-1.5">
                          {exp.highlights.map((h, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-xs text-muted-foreground"
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full mt-1.5 shrink-0 ${accent.dot}`}
                              />
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Current badge */}
                      {exp.current && (
                        <div className="mt-3 flex items-center gap-1.5">
                          <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                          </span>
                          <span className="text-[11px] text-green-600 dark:text-green-400 font-medium">
                            Current
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mt-8 text-xs text-muted-foreground/60 font-mono"
        >
          {allExperiences.filter((e) => e.type === "work").length} work roles ·{" "}
          {allExperiences.filter((e) => e.type === "education").length} education
        </motion.div>
      </div>
    </section>
  );
}
