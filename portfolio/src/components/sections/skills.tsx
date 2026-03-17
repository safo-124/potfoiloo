"use client";

import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const skillCategories = [
  {
    id: "languages",
    label: "Languages",
    skills: [
      { name: "Python", level: 95 },
      { name: "MATLAB", level: 90 },
      { name: "C/C++", level: 75 },
      { name: "TypeScript", level: 70 },
      { name: "SQL", level: 70 },
      { name: "R", level: 60 },
    ],
  },
  {
    id: "frameworks",
    label: "Frameworks & Libraries",
    skills: [
      { name: "PyTorch", level: 90 },
      { name: "TensorFlow/Keras", level: 85 },
      { name: "Scikit-learn", level: 90 },
      { name: "NumPy/SciPy", level: 95 },
      { name: "Pandas", level: 90 },
      { name: "OpenCV", level: 80 },
      { name: "Hugging Face", level: 75 },
      { name: "Next.js/React", level: 65 },
    ],
  },
  {
    id: "tools",
    label: "Tools & Platforms",
    skills: [
      { name: "Git/GitHub", level: 90 },
      { name: "Docker", level: 75 },
      { name: "Linux", level: 80 },
      { name: "Jupyter", level: 95 },
      { name: "VS Code", level: 90 },
      { name: "AWS/GCP", level: 60 },
      { name: "Weights & Biases", level: 70 },
      { name: "LaTeX", level: 85 },
    ],
  },
  {
    id: "domains",
    label: "Domain Expertise",
    skills: [
      { name: "Digital Signal Processing", level: 95 },
      { name: "Deep Learning", level: 90 },
      { name: "Computer Vision", level: 80 },
      { name: "Speech/Audio Processing", level: 85 },
      { name: "Statistical Modeling", level: 85 },
      { name: "Time-Series Analysis", level: 80 },
      { name: "Natural Language Processing", level: 70 },
      { name: "Embedded Systems", level: 65 },
    ],
  },
];

function SkillBar({ name, level, delay }: { name: string; level: number; delay: number }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{name}</span>
        <span className="text-xs text-muted-foreground font-mono">{level}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          transition={{ duration: 1, delay, ease: "easeOut" }}
          viewport={{ once: true }}
          className={cn(
            "h-full rounded-full",
            level >= 90
              ? "bg-primary"
              : level >= 75
              ? "bg-primary/80"
              : level >= 60
              ? "bg-primary/60"
              : "bg-primary/40"
          )}
        />
      </div>
    </div>
  );
}

interface SkillData {
  name: string; category: string; level: number;
}
interface SkillCategory {
  id: string; label: string; skills: { name: string; level: number }[];
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
  const categories = data && data.length > 0 ? groupSkillsIntoCategories(data) : skillCategories;
  return (
    <section id="skills" className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Technical <span className="text-primary">Skills</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
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
          <Tabs defaultValue="languages" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8">
              {categories.map((cat) => (
                <TabsTrigger key={cat.id} value={cat.id}>
                  {cat.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((cat) => (
              <TabsContent key={cat.id} value={cat.id}>
                <div className="p-6 rounded-lg border border-border bg-card">
                  <div className="space-y-5">
                    {cat.skills.map((skill, index) => (
                      <SkillBar
                        key={skill.name}
                        name={skill.name}
                        level={skill.level}
                        delay={index * 0.05}
                      />
                    ))}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </div>
    </section>
  );
}
