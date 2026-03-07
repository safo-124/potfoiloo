"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Brain, Radio, Code2, Database } from "lucide-react";

const highlights = [
  {
    icon: Radio,
    title: "Signal Processing",
    description:
      "Expert in DSP, adaptive filtering, spectral analysis, and wavelet transforms for real-world signal applications.",
  },
  {
    icon: Brain,
    title: "Machine Learning",
    description:
      "Proficient in deep learning, neural networks, and statistical modeling for classification, regression, and generation tasks.",
  },
  {
    icon: Code2,
    title: "Software Engineering",
    description:
      "Building production-quality code in Python, MATLAB, C++, and modern web technologies.",
  },
  {
    icon: Database,
    title: "Data Analysis",
    description:
      "Experienced in processing large-scale datasets, feature engineering, and building end-to-end ML pipelines.",
  },
];

const techStack = [
  "Python",
  "PyTorch",
  "TensorFlow",
  "MATLAB",
  "Scikit-learn",
  "NumPy",
  "Pandas",
  "OpenCV",
  "C++",
  "Docker",
  "Git",
  "SQL",
  "Next.js",
  "TypeScript",
];

export function AboutSection() {
  return (
    <section id="about" className="py-24 bg-card/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            About <span className="text-primary">Me</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A passionate engineer at the intersection of signal theory and
            artificial intelligence
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Bio with Profile Pic */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            {/* Profile Picture */}
            <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-2xl overflow-hidden border-2 border-primary/20 shadow-xl mb-8">
              <Image
                src="/profile_pic.jpg"
                alt="Emmanuel Safo Acheampong"
                fill
                className="object-cover"
              />
            </div>

            <div className="prose prose-lg dark:prose-invert">
              <p className="text-muted-foreground leading-relaxed mb-6">
                I am a Masters graduate in Signal Processing and Machine
                Learning with a deep passion for transforming raw data into
                actionable intelligence. My research bridges classical signal
                processing techniques with modern deep learning approaches.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                During my Masters, I focused on developing novel algorithms that
                combine the mathematical rigor of DSP with the learning power of
                neural networks. My work spans areas including adaptive
                filtering, speech enhancement, image processing, and predictive
                modeling.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                I&apos;m passionate about building systems that listen, see, and
                understand — turning signals into insights that make a real
                difference. When I&apos;m not coding, you&apos;ll find me
                reading research papers or exploring new datasets.
              </p>
            </div>

            {/* Tech Stack */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <Badge key={tech} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Highlight Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {highlights.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors group"
              >
                <item.icon className="h-8 w-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
