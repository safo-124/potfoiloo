"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Menu,
  X,
  Sun,
  Moon,
  Terminal,
  Home,
  User,
  FolderKanban,
  BookOpen,
  PenLine,
  Mail,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home", icon: Home, description: "Back to start" },
  { href: "/about", label: "About", icon: User, description: "Who I am" },
  {
    href: "/projects",
    label: "Projects",
    icon: FolderKanban,
    description: "My work & builds",
  },
  {
    href: "/publications",
    label: "Publications",
    icon: BookOpen,
    description: "Research papers",
  },
  {
    href: "/blog",
    label: "Blog",
    icon: PenLine,
    description: "Thoughts & tutorials",
  },
  {
    href: "/contact",
    label: "Contact",
    icon: Mail,
    description: "Get in touch",
  },
];

const overlayVariants = {
  closed: {
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut" as const,
      when: "afterChildren" as const,
    },
  },
  open: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeInOut" as const,
      when: "beforeChildren" as const,
    },
  },
};

const menuContainerVariants = {
  closed: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
  open: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
};

const menuItemVariants = {
  closed: { opacity: 0, x: -30, filter: "blur(8px)" },
  open: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.35, ease: [0.25, 0.4, 0.25, 1] as const },
  },
};

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const mainLinks = navLinks.filter((l) => l.href !== "/contact");
  const contactLink = navLinks.find((l) => l.href === "/contact")!;

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-background/70 backdrop-blur-2xl border-b border-border/50 shadow-[0_1px_30px_-12px] shadow-primary/10"
            : "bg-transparent"
        )}
      >
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="group flex items-center gap-2.5 text-primary font-bold text-xl"
            >
              <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 group-hover:bg-primary/15 transition-colors duration-300">
                <Terminal className="h-4.5 w-4.5" />
              </div>
              <div className="flex items-baseline gap-px font-mono">
                <span className="text-foreground font-bold tracking-tight">
                  ESA
                </span>
                <span className="text-primary animate-pulse">_</span>
              </div>
            </Link>

            {/* Desktop Nav — centered pill */}
            <div className="hidden md:flex items-center">
              <div
                className={cn(
                  "flex items-center gap-0.5 rounded-full px-1.5 py-1 transition-all duration-500",
                  scrolled
                    ? "bg-muted/50 border border-border/50"
                    : "bg-muted/30"
                )}
              >
                {mainLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "relative px-3.5 py-1.5 text-sm font-medium transition-all duration-200 rounded-full",
                        isActive
                          ? "text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="navbar-pill"
                          className="absolute inset-0 bg-primary rounded-full shadow-md shadow-primary/25"
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 30,
                          }}
                        />
                      )}
                      <span className="relative z-10">{link.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Contact CTA + theme toggle */}
              <div className="flex items-center gap-2 ml-3">
                <Link
                  href={contactLink.href}
                  className={cn(
                    "relative px-4 py-1.5 text-sm font-medium rounded-full border transition-all duration-200",
                    pathname === contactLink.href
                      ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/25"
                      : "border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground hover:shadow-md hover:shadow-primary/25"
                  )}
                >
                  {contactLink.label}
                </Link>
                {mounted && (
                  <button
                    onClick={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                    className="flex items-center justify-center w-8 h-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
                  >
                    <AnimatePresence mode="wait">
                      {theme === "dark" ? (
                        <motion.div
                          key="sun"
                          initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                          animate={{ rotate: 0, opacity: 1, scale: 1 }}
                          exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Sun className="h-4 w-4" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="moon"
                          initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                          animate={{ rotate: 0, opacity: 1, scale: 1 }}
                          exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Moon className="h-4 w-4" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                )}
              </div>
            </div>

            {/* Mobile: theme + hamburger */}
            <div className="md:hidden flex items-center gap-1">
              {mounted && (
                <button
                  onClick={() =>
                    setTheme(theme === "dark" ? "light" : "dark")
                  }
                  className="flex items-center justify-center w-9 h-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                  {theme === "dark" ? (
                    <Sun className="h-4.5 w-4.5" />
                  ) : (
                    <Moon className="h-4.5 w-4.5" />
                  )}
                </button>
              )}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative z-60 flex items-center justify-center w-9 h-9 rounded-full hover:bg-muted/50 transition-colors"
              >
                <AnimatePresence mode="wait">
                  {isOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Fullscreen Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 z-55 md:hidden"
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-background/98 backdrop-blur-xl" />

            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
              <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
            </div>

            {/* Menu Content */}
            <div className="relative h-full flex flex-col justify-center px-6 sm:px-8">
              {/* Navigation label */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="absolute top-20 left-6 sm:left-8"
              >
                <p className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase">
                  Navigation
                </p>
              </motion.div>

              {/* Links */}
              <motion.ul
                variants={menuContainerVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="flex flex-col gap-1"
              >
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <motion.li key={link.href} variants={menuItemVariants}>
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "group flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200",
                          isActive
                            ? "bg-primary/10 border border-primary/20"
                            : "hover:bg-muted/50 border border-transparent"
                        )}
                      >
                        {/* Icon */}
                        <div
                          className={cn(
                            "flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-200",
                            isActive
                              ? "bg-primary/20 text-primary shadow-lg shadow-primary/10"
                              : "bg-muted/80 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "text-lg font-semibold transition-colors",
                                isActive
                                  ? "text-primary"
                                  : "text-foreground group-hover:text-primary"
                              )}
                            >
                              {link.label}
                            </span>
                            {isActive && (
                              <motion.span
                                layoutId="mobile-active-dot"
                                className="w-1.5 h-1.5 rounded-full bg-primary"
                              />
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {link.description}
                          </span>
                        </div>

                        {/* Arrow */}
                        <ArrowRight
                          className={cn(
                            "h-4 w-4 transition-all duration-200 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100",
                            isActive
                              ? "text-primary opacity-100 translate-x-0"
                              : "text-muted-foreground"
                          )}
                        />
                      </Link>
                    </motion.li>
                  );
                })}
              </motion.ul>

              {/* Bottom section */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="absolute bottom-10 left-6 right-6 sm:left-8 sm:right-8"
              >
                <div className="flex items-center gap-3 px-4">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase">
                    Emmanuel Safo Acheampong
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
