"use client";

import { motion } from "framer-motion";
import { GraduationCap, Briefcase, FlaskConical } from "lucide-react";



const typeIcons = {
  education: GraduationCap,
  work: Briefcase,
  research: FlaskConical,
};

const typeColors = {
  education: "bg-blue-500/10 text-blue-500 border-blue-500/30",
  work: "bg-primary/10 text-primary border-primary/30",
  research: "bg-purple-500/10 text-purple-500 border-purple-500/30",
};

interface ExperienceData {
  type: string; title: string; company: string; location?: string | null;
  startDate: string; endDate?: string | null; current: boolean;
  description: string; highlights?: string[];
}

export function ExperienceSection({ data }: { data?: ExperienceData[] }) {
  const allExperiences = data ?? [];

  if (allExperiences.length === 0) {
    return (
      <section id="experience" className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Experience & <span className="text-primary">Education</span>
          </h2>
          <p className="text-muted-foreground">Experience will appear here once added via the admin dashboard.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="experience" className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Experience & <span className="text-primary">Education</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            My academic journey and professional experience in signal processing
            and machine learning
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-3xl mx-auto">
          {/* Timeline line */}
          <div className="absolute left-6 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-border" />

          {allExperiences.map((exp, index) => {
            const Icon =
              typeIcons[exp.type as keyof typeof typeIcons] || Briefcase;
            const colorClass =
              typeColors[exp.type as keyof typeof typeColors] ||
              typeColors.work;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative flex items-start gap-6 mb-12 ${
                  index % 2 === 0
                    ? "md:flex-row"
                    : "md:flex-row-reverse md:text-right"
                }`}
              >
                {/* Icon */}
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${colorClass}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                {/* Content */}
                <div
                  className={`ml-20 md:ml-0 md:w-[calc(50%-2rem)] ${
                    index % 2 === 0 ? "md:pr-8" : "md:pl-8"
                  }`}
                >
                  <div className="p-6 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span
                        className={`text-xs font-mono px-2 py-1 rounded border ${colorClass}`}
                      >
                        {exp.type.charAt(0).toUpperCase() + exp.type.slice(1)}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono">
                        {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{exp.title}</h3>
                    <p className="text-sm text-primary font-medium mb-2">
                      {exp.company}
                      {exp.location && (
                        <span className="text-muted-foreground">
                          {" "}
                          · {exp.location}
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground mb-3">
                      {exp.description}
                    </p>
                    <ul
                      className={`text-xs text-muted-foreground space-y-1 ${
                        index % 2 !== 0 ? "md:text-right" : ""
                      }`}
                    >
                      {exp.highlights?.map((h, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-primary mt-1">▸</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
