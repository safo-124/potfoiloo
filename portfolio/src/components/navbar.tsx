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
    transition: { duration: 0.3, ease: "easeInOut" as const, when: "afterChildren" as const },
  },
  open: {
    opacity: 1,
    transition: { duration: 0.3, ease: "easeInOut" as const, when: "beforeChildren" as const },
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
    window.addEventListener("scroll", handleScroll);
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

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-background/80 backdrop-blur-lg border-b border-border shadow-sm"
            : "bg-transparent"
        )}
      >
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 text-primary font-bold text-xl"
            >
              <Terminal className="h-6 w-6" />
              <span className="font-mono">ESA</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-3 py-2 text-sm font-medium transition-colors rounded-md hover:bg-accent",
                    pathname === link.href
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary"
                  )}
                >
                  {link.label}
                  {pathname === link.href && (
                    <motion.div
                      layoutId="navbar-active"
                      className="absolute inset-0 bg-accent rounded-md -z-10"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              ))}
              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="ml-2"
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </Button>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden flex items-center gap-2">
              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className="relative z-60"
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
              </Button>
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
              <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl" />
              <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-emerald-500/5 blur-3xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 rounded-full border border-emerald-500/5" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-75 h-75 rounded-full border border-emerald-500/5" />
            </div>

            {/* Menu Content */}
            <div className="relative h-full flex flex-col justify-center px-8">
              {/* Top branding area */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="absolute top-20 left-8"
              >
                <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase">
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
                {navLinks.map((link, i) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <motion.li key={link.href} variants={menuItemVariants}>
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "group flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-200",
                          isActive
                            ? "bg-emerald-500/10 border border-emerald-500/20"
                            : "hover:bg-muted/50 border border-transparent"
                        )}
                      >
                        {/* Icon */}
                        <div
                          className={cn(
                            "flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200",
                            isActive
                              ? "bg-emerald-500/20 text-emerald-500 shadow-lg shadow-emerald-500/10"
                              : "bg-muted/80 text-muted-foreground group-hover:bg-emerald-500/10 group-hover:text-emerald-500"
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
                                  ? "text-emerald-500"
                                  : "text-foreground group-hover:text-emerald-500"
                              )}
                            >
                              {link.label}
                            </span>
                            {isActive && (
                              <motion.span
                                layoutId="mobile-active-dot"
                                className="w-1.5 h-1.5 rounded-full bg-emerald-500"
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
                              ? "text-emerald-500 opacity-100 translate-x-0"
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
                className="absolute bottom-12 left-8 right-8"
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
