"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

function SkillBar({
  name,
  level,
  delay,
}: {
  name: string;
  level: number;
  delay: number;
}) {
  return (
    <div className="group relative p-3 sm:p-4 rounded-xl border border-border bg-card/60 hover:border-primary/30 transition-all duration-300">
      <div className="flex justify-between items-center mb-2.5">
        <span className="text-sm font-medium truncate pr-2">{name}</span>
        <span className="text-xs text-primary font-mono font-semibold shrink-0">
          {level}%
        </span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          transition={{ duration: 1, delay, ease: "easeOut" }}
          viewport={{ once: true }}
          className="h-full rounded-full bg-linear-to-r from-primary/80 via-primary to-primary/90 relative"
        >
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent" />
        </motion.div>
      </div>
    </div>
  );
}

interface SkillData {
  name: string;
  category: string;
  level: number;
}
interface SkillCategory {
  id: string;
  label: string;
  skills: { name: string; level: number }[];
}

function groupSkillsIntoCategories(skills: SkillData[]): SkillCategory[] {
  const catMap: Record<string, { name: string; level: number }[]> = {};
  for (const s of skills) {
    const key = s.category;
    if (!catMap[key]) catMap[key] = [];
    catMap[key].push({ name: s.name, level: s.level });
  }
  return Object.entries(catMap).map(([label, skills]) => ({
    id: label.toLowerCase().replace(/[^a-z]/g, ""),
    label,
    skills,
  }));
}

export function SkillsSection({ data }: { data?: SkillData[] }) {
  const categories = data ? groupSkillsIntoCategories(data) : [];
  const [activeId, setActiveId] = useState(categories[0]?.id ?? "");
  const scrollRef = useRef<HTMLDivElement>(null);

  if (categories.length === 0) {
    return (
      <section id="skills" className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Technical <span className="text-primary">Skills</span>
          </h2>
          <p className="text-muted-foreground">
            Skills will appear here once added via the admin dashboard.
          </p>
        </div>
      </section>
    );
  }

  const activeCategory = categories.find((c) => c.id === activeId) ?? categories[0];

  return (
    <section id="skills" className="py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Technical <span className="text-primary">Skills</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            A comprehensive overview of my technical capabilities across
            languages, frameworks, tools, and domain expertise
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          {/* Horizontal scrollable pill selector */}
          <div
            ref={scrollRef}
            className="flex gap-2 overflow-x-auto pb-2 mb-6 sm:mb-8 scrollbar-hide sm:justify-center sm:flex-wrap"
          >
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveId(cat.id)}
                className={cn(
                  "relative shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
                  activeId === cat.id
                    ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                    : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                )}
              >
                {cat.label}
                <span
                  className={cn(
                    "ml-1.5 text-xs font-mono",
                    activeId === cat.id
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground/50"
                  )}
                >
                  {cat.skills.length}
                </span>
              </button>
            ))}
          </div>

          {/* Skill grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            {activeCategory.skills.map((skill, index) => (
              <SkillBar
                key={`${activeId}-${skill.name}`}
                name={skill.name}
                level={skill.level}
                delay={index * 0.05}
              />
            ))}
          </div>

          {/* Summary footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              {activeCategory.skills.length} skills in{" "}
              <span className="text-primary font-medium">
                {activeCategory.label}
              </span>{" "}
              · Average proficiency:{" "}
              <span className="text-primary font-mono font-medium">
                {Math.round(
                  activeCategory.skills.reduce((sum, s) => sum + s.level, 0) /
                    activeCategory.skills.length
                )}
                %
              </span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
