"use client";

import { motion } from "framer-motion";

interface PageHeaderProps {
  title: string;
  highlight: string;
  description: string;
}

export function PageHeader({ title, highlight, description }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-16"
    >
      <h1 className="text-3xl sm:text-4xl font-bold mb-4">
        {title} <span className="text-primary">{highlight}</span>
      </h1>
      <p className="text-muted-foreground max-w-2xl mx-auto">{description}</p>
    </motion.div>
  );
}
