"use client";

import { useState } from "react";
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

const categories = [
  "All",
  "Machine Learning",
  "Signal Processing",
  "Computer Vision",
  "Deep Learning",
  "NLP",
];

const projects = [
  {
    title: "Neural Speech Enhancement",
    slug: "neural-speech-enhancement",
    description:
      "Deep learning-based speech denoising system using a U-Net architecture with attention mechanisms. Achieves state-of-the-art PESQ scores on the VoiceBank-DEMAND dataset.",
    tags: ["Deep Learning", "Signal Processing", "PyTorch", "Audio"],
    category: "Signal Processing",
    featured: true,
    imageUrl: "/projects/speech-enhancement.png",
    demoUrl: "https://demo.example.com",
    githubUrl: "https://github.com",
  },
  {
    title: "Adaptive Beamforming with DNN",
    slug: "adaptive-beamforming",
    description:
      "Novel beamforming algorithm combining MVDR with deep neural networks for robust spatial filtering in multi-source environments.",
    tags: ["Signal Processing", "Deep Learning", "MATLAB", "Python"],
    category: "Signal Processing",
    featured: true,
    imageUrl: "/projects/beamforming.png",
    githubUrl: "https://github.com",
  },
  {
    title: "Real-time Object Detection System",
    slug: "object-detection",
    description:
      "Optimized YOLOv8 model for real-time object detection on edge devices. Achieved 30 FPS on Jetson Nano with minimal accuracy loss.",
    tags: ["Computer Vision", "Deep Learning", "Python", "TensorRT"],
    category: "Computer Vision",
    featured: true,
    imageUrl: "/projects/object-detection.png",
    demoUrl: "https://demo.example.com",
    githubUrl: "https://github.com",
  },
  {
    title: "EEG Signal Classification",
    slug: "eeg-classification",
    description:
      "CNN-LSTM hybrid model for classifying EEG signals into different mental states. Used for brain-computer interface applications.",
    tags: ["Machine Learning", "Signal Processing", "TensorFlow", "BCI"],
    category: "Machine Learning",
    featured: false,
    imageUrl: "/projects/eeg.png",
    githubUrl: "https://github.com",
  },
  {
    title: "Sentiment Analysis Pipeline",
    slug: "sentiment-analysis",
    description:
      "End-to-end NLP pipeline for multi-language sentiment analysis using fine-tuned BERT models with custom tokenization.",
    tags: ["NLP", "Deep Learning", "Transformers", "Python"],
    category: "NLP",
    featured: false,
    imageUrl: "/projects/sentiment.png",
    githubUrl: "https://github.com",
  },
  {
    title: "Wavelet-based Image Denoising",
    slug: "wavelet-denoising",
    description:
      "Advanced image denoising technique using wavelet decomposition combined with learned thresholding via a lightweight CNN.",
    tags: ["Signal Processing", "Computer Vision", "MATLAB", "Python"],
    category: "Computer Vision",
    featured: false,
    imageUrl: "/projects/wavelet.png",
    githubUrl: "https://github.com",
  },
];

interface ProjectData {
  title: string; slug: string; description: string; tags: string[];
  category: string; featured: boolean; imageUrl?: string | null;
  demoUrl?: string | null; githubUrl?: string | null;
}

export function ProjectsSection({ data }: { data?: ProjectData[] }) {
  const [filter, setFilter] = useState("All");
  const allProjects = data && data.length > 0 ? data : projects;

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
                <Card className="h-full flex flex-col hover:border-primary/50 transition-all duration-300 group overflow-hidden">
                  {/* Project Image Placeholder */}
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
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
