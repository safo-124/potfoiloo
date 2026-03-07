"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock } from "lucide-react";
import Link from "next/link";

const blogPosts = [
  {
    title: "Understanding Fourier Transforms: From Theory to Python Implementation",
    slug: "understanding-fourier-transforms",
    excerpt:
      "A deep dive into the Discrete Fourier Transform, its mathematical foundations, and how to implement it efficiently in Python with NumPy.",
    tags: ["DSP", "Python", "Tutorial"],
    date: "2025-12-15",
    readTime: "8 min",
  },
  {
    title: "Building a Real-Time Audio Classifier with PyTorch",
    slug: "real-time-audio-classifier",
    excerpt:
      "Step-by-step guide to building and deploying a real-time audio classification system using mel spectrograms and a compact CNN architecture.",
    tags: ["Deep Learning", "Audio", "PyTorch"],
    date: "2025-11-28",
    readTime: "12 min",
  },
  {
    title: "Kalman Filters Explained: Tracking Moving Objects",
    slug: "kalman-filters-tracking",
    excerpt:
      "An intuitive explanation of Kalman filters with practical examples in tracking applications. Includes Python code and visualizations.",
    tags: ["Signal Processing", "Python", "Tutorial"],
    date: "2025-10-10",
    readTime: "10 min",
  },
];

export function BlogSection() {
  return (
    <section id="blog" className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Latest <span className="text-primary">Articles</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Technical articles, tutorials, and insights on signal processing,
            machine learning, and software engineering
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {blogPosts.map((post, index) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={`/blog/${post.slug}`}>
                <Card className="h-full hover:border-primary/50 transition-all duration-300 group cursor-pointer">
                  {/* Gradient header */}
                  <div className="h-2 bg-gradient-to-r from-primary/60 to-primary rounded-t-lg" />

                  <CardHeader>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                      <span className="font-mono">
                        {new Date(post.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </span>
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors leading-snug">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {post.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <span className="text-sm text-primary font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read article
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link
            href="/blog"
            className="text-primary font-medium hover:underline inline-flex items-center gap-1"
          >
            View all articles
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
