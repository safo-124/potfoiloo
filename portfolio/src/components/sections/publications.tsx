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
import { Button } from "@/components/ui/button";
import { FileText, ExternalLink, BookOpen } from "lucide-react";



const typeStyles = {
  conference: "bg-blue-500/10 text-blue-500",
  journal: "bg-primary/10 text-primary",
  thesis: "bg-purple-500/10 text-purple-500",
};

interface PublicationData {
  title: string; authors: string; venue: string; year: number;
  type: string; abstract?: string | null; doi?: string | null; pdfUrl?: string | null;
}

export function PublicationsSection({ data }: { data?: PublicationData[] }) {
  const allPublications = data ?? [];

  if (allPublications.length === 0) {
    return (
      <section id="publications" className="py-24 bg-card/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Publications & <span className="text-primary">Research</span>
          </h2>
          <p className="text-muted-foreground">Publications will appear here once added via the admin dashboard.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="publications" className="py-24 bg-card/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Publications & <span className="text-primary">Research</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Peer-reviewed publications and research contributions in signal
            processing and machine learning
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-6">
          {allPublications.map((pub, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      className={
                        typeStyles[pub.type as keyof typeof typeStyles]
                      }
                    >
                      {pub.type === "conference"
                        ? "Conference"
                        : pub.type === "journal"
                        ? "Journal"
                        : "Thesis"}
                    </Badge>
                    <span className="text-xs text-muted-foreground font-mono">
                      {pub.year}
                    </span>
                  </div>
                  <CardTitle className="text-lg leading-snug">
                    {pub.title}
                  </CardTitle>
                  <CardDescription>
                    <span className="font-medium">{pub.authors}</span>
                    <br />
                    <span className="italic">{pub.venue}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {pub.abstract}
                  </p>
                  <div className="flex gap-2">
                    {pub.pdfUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={pub.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          PDF
                        </a>
                      </Button>
                    )}
                    {pub.doi && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={`https://doi.org/${pub.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          DOI
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Google Scholar Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Button variant="outline" asChild>
            <a
              href="https://scholar.google.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              View all on Google Scholar
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
