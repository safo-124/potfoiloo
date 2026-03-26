"use client";

import { useRef, useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";

interface BrowserFrameProps {
  url: string;
  title: string;
  /** Height of the virtual viewport (default 800px) */
  height?: number;
  /** Whether to show the external link button */
  showExternalLink?: boolean;
  /** Optional className for the container */
  className?: string;
}

export function BrowserFrame({
  url,
  title,
  height = 800,
  showExternalLink = false,
  className = "",
}: BrowserFrameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.3);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Lazy-load: only render iframe when near viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);

    // Scale to fit container width
    const measure = () => setScale(el.offsetWidth / 1280);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);

    return () => {
      observer.disconnect();
      ro.disconnect();
    };
  }, []);

  return (
    <div
      className={`relative w-full rounded-xl overflow-hidden border border-border bg-muted/30 shadow-sm ${className}`}
    >
      {/* Browser toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-muted/60 border-b border-border">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
        </div>
        <div className="flex-1 mx-2">
          <div className="bg-background/60 rounded-md px-3 py-0.5 text-[10px] text-muted-foreground truncate font-mono">
            {url.replace(/^https?:\/\//, "")}
          </div>
        </div>
        {showExternalLink && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>

      {/* Iframe viewport — scales to fill container width */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden"
        style={{ height: `${height * scale}px` }}
      >
        {isVisible ? (
          <iframe
            src={url}
            title={`Preview of ${title}`}
            className="absolute top-0 left-0 border-0 pointer-events-none"
            style={{
              width: "1280px",
              height: `${height}px`,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
            loading="lazy"
            sandbox="allow-scripts allow-same-origin"
            tabIndex={-1}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/40 text-sm">
            <div className="flex flex-col items-center gap-2">
              <div className="h-6 w-6 border-2 border-muted-foreground/20 border-t-primary/50 rounded-full animate-spin" />
              <span className="text-xs">Loading preview…</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
