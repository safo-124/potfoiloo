"use client";

import { motion } from "framer-motion";
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

const featuredProjects = [
  {
    title: "Neural Speech Enhancement",
    description:
      "Deep learning-based speech denoising using U-Net with attention mechanisms.",
    tags: ["Deep Learning", "Signal Processing", "PyTorch"],
    category: "Signal Processing",
  },
  {
    title: "Adaptive Beamforming with DNN",
    description:
      "Hybrid beamforming combining MVDR with deep neural networks for spatial filtering.",
    tags: ["Signal Processing", "Deep Learning", "MATLAB"],
    category: "Signal Processing",
  },
  {
    title: "Real-time Object Detection",
    description:
      "Optimized YOLOv8 for edge deployment achieving 30 FPS on Jetson Nano.",
    tags: ["Computer Vision", "Deep Learning", "TensorRT"],
    category: "Computer Vision",
  },
];

const highlights = [
  { icon: Radio, title: "Signal Processing", color: "text-emerald-500" },
  { icon: Brain, title: "Machine Learning", color: "text-emerald-400" },
  { icon: Code2, title: "Software Engineering", color: "text-emerald-600" },
  { icon: Database, title: "Data Analysis", color: "text-emerald-500" },
];

interface HomePreviewProps {
  featuredProjectsData?: { title: string; description: string; tags: string[]; category: string }[];
  stats?: { projects: string; publications: string; yearsStudy: string; languages: string };
}

export function HomePreview({ featuredProjectsData, stats: statsData }: HomePreviewProps) {
  const displayProjects = featuredProjectsData && featuredProjectsData.length > 0 ? featuredProjectsData : featuredProjects;
  return (
    <>
      {/* About Preview */}
      <section className="py-24 bg-card/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              {/* Profile pic for about preview */}
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto lg:mx-0 rounded-2xl overflow-hidden border-2 border-primary/20 shadow-xl mb-6">
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
      <section className="py-24">
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
                <Card className="h-full hover:border-primary/50 transition-all group">
                  <div className="h-3 bg-gradient-to-r from-primary/60 to-primary rounded-t-lg" />
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

      {/* Quick Stats / CTA Row */}
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {[
              { icon: Briefcase, label: "Projects", value: statsData?.projects || "6+" },
              { icon: BookOpen, label: "Publications", value: statsData?.publications || "3" },
              { icon: GraduationCap, label: "Years Study", value: statsData?.yearsStudy || "6+" },
              { icon: Code2, label: "Languages", value: statsData?.languages || "8+" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 rounded-lg border border-border bg-card"
              >
                <stat.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
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
