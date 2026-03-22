"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download, Github, Linkedin } from "lucide-react";

/* ─── Text Scramble Hook ─── */
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*";
function useTextScramble(finalText: string, delay = 0) {
  const [display, setDisplay] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    let frame = 0;
    const totalFrames = 20;
    const timeout = setTimeout(() => {
      const iv = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        const revealed = Math.floor(progress * finalText.length);
        let result = "";
        for (let i = 0; i < finalText.length; i++) {
          if (finalText[i] === " ") { result += " "; continue; }
          result += i < revealed ? finalText[i] : chars[Math.floor(Math.random() * chars.length)];
        }
        setDisplay(result);
        if (frame >= totalFrames) { clearInterval(iv); setDisplay(finalText); setDone(true); }
      }, 40);
      return () => clearInterval(iv);
    }, delay);
    return () => clearTimeout(timeout);
  }, [finalText, delay]);
  return { display, done };
}

/* ─── Spotlight Dot Grid ─── */
function SpotlightGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -1000, y: -1000 });

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);
    const gap = 40;
    const radius = 120;
    for (let x = gap; x < w; x += gap) {
      for (let y = gap; y < h; y += gap) {
        const dx = x - mouse.current.x;
        const dy = y - mouse.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const intensity = Math.max(0, 1 - dist / radius);
        const size = 1 + intensity * 2.5;
        const alpha = 0.08 + intensity * 0.55;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(16, 185, 129, ${alpha})`;
        ctx.fill();
      }
    }
  }, []);

  useEffect(() => {
    let raf: number;
    const loop = () => { draw(); raf = requestAnimationFrame(loop); };
    loop();
    const handleMove = (e: MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) { mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }; }
    };
    const handleLeave = () => { mouse.current = { x: -1000, y: -1000 }; };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseleave", handleLeave);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("mousemove", handleMove); window.removeEventListener("mouseleave", handleLeave); };
  }, [draw]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

interface HeroProps {
  settings?: {
    name?: string | null;
    title?: string | null;
    tagline?: string | null;
    github?: string | null;
    linkedin?: string | null;
    resumeUrl?: string | null;
  };
}

export function HeroSection({ settings }: HeroProps) {
  const firstName = settings?.name?.split(" ")[0] || "Emmanuel";
  const titleText = settings?.title || "Signal Processing & Machine Learning Engineer";
  const taglineText = settings?.tagline || "Bridging the gap between signal theory and intelligent systems.";

  const nameScramble = useTextScramble(firstName, 400);
  const titleScramble = useTextScramble(titleText, 900);
  const taglineScramble = useTextScramble(taglineText, 1400);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Interactive spotlight dot grid */}
      <div className="absolute inset-0 -z-10">
        <SpotlightGrid />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        {/* Floating orbs */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.25, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-8 lg:gap-12 pt-20 lg:pt-0">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Redesigned status badge */}
              <div className="inline-flex items-center gap-3 px-1.5 pr-5 py-1.5 rounded-full border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent backdrop-blur-sm text-sm font-mono mb-6 shadow-sm shadow-primary/5">
                <span className="flex items-center justify-center h-7 w-7 rounded-full bg-primary/15 ring-1 ring-primary/30">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                </span>
                <span className="text-primary font-medium tracking-wide">Available for work</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-4 sm:mb-6"
            >
              Hi, I&apos;m{" "}
              <span className="text-primary font-mono">{nameScramble.display || firstName}</span>
              {nameScramble.done && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="text-primary"
                >
                  _
                </motion.span>
              )}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.8 }}
              className="text-lg sm:text-2xl text-muted-foreground mb-3 sm:mb-4 font-light max-w-2xl"
            >
              {titleScramble.display || titleText}
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 1.3 }}
              className="text-sm sm:text-base text-muted-foreground/80 mb-8 sm:mb-10 max-w-xl font-mono"
            >
              {taglineScramble.display || taglineText}
              <br />
              MSc in Signal Processing &amp; Machine Learning.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.8 }}
              className="flex flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4"
            >
              <Button size="lg" className="text-sm sm:text-base" asChild>
                <Link href="/projects">
                  View My Work
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-sm sm:text-base" asChild>
                <a href={settings?.resumeUrl || "/emmanuel-safo-cv.pdf"} target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-4 w-4" />
                  Download CV
                </a>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 2.0 }}
              className="flex items-center justify-center lg:justify-start gap-4 mt-6 sm:mt-8"
            >
              <a
                href={settings?.github || "https://github.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg border border-border bg-card/50 text-muted-foreground hover:text-primary hover:border-primary/50 transition-all"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href={settings?.linkedin || "https://linkedin.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg border border-border bg-card/50 text-muted-foreground hover:text-primary hover:border-primary/50 transition-all"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </motion.div>
          </div>

          {/* Profile Picture — shows FIRST on mobile (flex-col-reverse) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex-shrink-0"
          >
            <div className="relative">
              {/* Glow ring */}
              <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-primary/60 via-primary/20 to-primary/60 blur-md opacity-70 animate-pulse" />
              {/* Image container */}
              <div className="relative w-44 h-44 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-full overflow-hidden border-4 border-primary/30 shadow-2xl">
                <Image
                  src="/profile_pic.jpg"
                  alt="Emmanuel Safo Acheampong"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {/* Decorative dots */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/10 rounded-full blur-xl" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-primary/10 rounded-full blur-xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
