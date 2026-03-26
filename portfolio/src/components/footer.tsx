import Link from "next/link";
import {
  Github,
  Linkedin,
  Mail,
  BookOpen,
  Terminal,
  ArrowUpRight,
  Heart,
} from "lucide-react";
import { prisma } from "@/lib/prisma";

const quickLinks = [
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Publications", href: "/publications" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export async function Footer() {
  let settings: { github?: string | null; linkedin?: string | null; scholar?: string | null; email?: string | null } | null = null;
  try {
    settings = await prisma.siteSettings.findUnique({ where: { id: "main" } });
  } catch {
    // Fallback to defaults if DB is unavailable
  }

  const socials = [
    { href: settings?.github || "https://github.com", icon: Github, label: "GitHub" },
    { href: settings?.linkedin || "https://linkedin.com", icon: Linkedin, label: "LinkedIn" },
    { href: settings?.scholar || "https://scholar.google.com", icon: BookOpen, label: "Google Scholar" },
    { href: settings?.email ? `mailto:${settings.email}` : "mailto:hello@example.com", icon: Mail, label: "Email" },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border bg-card/80 overflow-hidden">
      {/* Subtle gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-10 md:py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 mb-3 group"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors">
                <Terminal className="h-4 w-4 text-primary" />
              </div>
              <span className="font-mono font-bold text-lg text-foreground">
                ESA<span className="text-primary">_</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Signal Processing & Machine Learning Engineer — building systems
              that listen, see, and understand.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Navigate
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Connect
            </h4>
            <ul className="space-y-2.5">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target={social.href.startsWith("mailto") ? undefined : "_blank"}
                    rel={social.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                    className="group inline-flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <social.icon className="h-4 w-4" />
                    <span>{social.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Status / CTA */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Status
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="text-sm text-muted-foreground">
                  Available for projects
                </span>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-full border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200"
              >
                <Mail className="h-3.5 w-3.5" />
                Get in touch
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border py-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
          <p>
            &copy; {currentYear} Emmanuel Safo Acheampong. All rights reserved.
          </p>
          <p className="inline-flex items-center gap-1 font-mono">
            Built with <Heart className="h-3 w-3 text-primary fill-primary" />{" "}
            using Next.js + Prisma
          </p>
        </div>
      </div>
    </footer>
  );
}
