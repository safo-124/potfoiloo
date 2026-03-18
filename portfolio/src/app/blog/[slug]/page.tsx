"use client";

import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Eye, Tag, Share2, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function BlogPostPage({
  params: paramsPromise,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [post, setPost] = useState<{
    title: string;
    date: string;
    readTime: string;
    tags: string[];
    content: string;
    views: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    async function load() {
      const { slug } = await paramsPromise;
      try {
        const res = await fetch(`/api/blog`);
        const posts = await res.json();
        const found = posts.find((p: { slug: string }) => p.slug === slug);
        if (found) {
          // Increment views
          if (found.id) {
            fetch(`/api/blog/${found.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ views: (found.views || 0) + 1 }),
            }).catch(() => {});
          }
          setPost({
            title: found.title,
            date: found.createdAt
              ? new Date(found.createdAt).toISOString().split("T")[0]
              : new Date().toISOString().split("T")[0],
            readTime: `${Math.max(1, Math.round((found.content?.length || 0) / 1000))} min`,
            tags: found.tags || [],
            content: found.content || "",
            views: found.views || 0,
          });
        }
      } catch {
        /* empty */
      }
      setLoading(false);
    }
    load();
  }, [paramsPromise]);

  // Reading progress
  useEffect(() => {
    function handleScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
      setShowTop(scrollTop > 500);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function renderMarkdown(md: string) {
    // Simple markdown-to-HTML conversion
    let html = md
      // Code blocks
      .replace(
        /```(\w+)?\n([\s\S]*?)```/g,
        '<pre class="bg-muted/50 border border-border rounded-xl p-5 overflow-x-auto my-6 text-sm"><code class="font-mono">$2</code></pre>'
      )
      // Inline code
      .replace(/`([^`]+)`/g, '<code class="bg-muted/50 border border-border px-1.5 py-0.5 rounded text-sm font-mono text-primary">$1</code>')
      // H3
      .replace(
        /^### (.+)$/gm,
        '<h3 class="text-xl font-bold mt-8 mb-3 text-foreground">$1</h3>'
      )
      // H2
      .replace(
        /^## (.+)$/gm,
        '<h2 class="text-2xl font-bold mt-12 mb-4 text-foreground flex items-center gap-2"><span class="h-6 w-1 bg-primary rounded-full inline-block"></span>$1</h2>'
      )
      // Bold
      .replace(/\*\*(.+?)\*\*/g, "<strong class='text-foreground font-semibold'>$1</strong>")
      // Italic
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      // Unordered list items
      .replace(
        /^- (.+)$/gm,
        '<li class="flex items-start gap-2 text-muted-foreground ml-4 mb-1.5"><span class="h-1.5 w-1.5 rounded-full bg-primary mt-2.5 shrink-0"></span><span>$1</span></li>'
      )
      // Ordered list items
      .replace(
        /^(\d+)\. (.+)$/gm,
        '<li class="flex items-start gap-2 text-muted-foreground ml-4 mb-1.5"><span class="text-primary font-mono text-sm font-bold">$1.</span><span>$2</span></li>'
      )
      // Blockquote
      .replace(
        /^> (.+)$/gm,
        '<blockquote class="border-l-4 border-primary/40 pl-4 italic text-muted-foreground my-4">$1</blockquote>'
      )
      // Horizontal rule
      .replace(
        /^---$/gm,
        '<hr class="my-8 border-border" />'
      )
      // Paragraphs
      .replace(
        /\n\n(?!<)/g,
        '</p><p class="text-muted-foreground leading-relaxed mb-4">'
      );

    // Wrap in paragraph
    html = '<p class="text-muted-foreground leading-relaxed mb-4">' + html + "</p>";
    // Clean empty paragraphs
    html = html.replace(/<p class="[^"]*"><\/p>/g, "");

    return html;
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium mb-2">Post not found</p>
          <Link href="/blog" className="text-primary hover:underline text-sm">
            Back to blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-muted/30">
        <div
          className="h-full bg-primary transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="min-h-screen pt-24 pb-16">
        <article className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to blog
          </Link>

          {/* Article header */}
          <header className="mb-10">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-5">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium flex items-center gap-1"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold leading-tight mb-5">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground pb-6 border-b border-border">
              <span className="flex items-center gap-1.5 font-mono text-xs">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(post.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1.5 font-mono text-xs">
                <Clock className="h-3.5 w-3.5" />
                {post.readTime} read
              </span>
              {post.views > 0 && (
                <span className="flex items-center gap-1.5 font-mono text-xs">
                  <Eye className="h-3.5 w-3.5" />
                  {post.views} views
                </span>
              )}
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: post.title, url: window.location.href });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                  }
                }}
                className="ml-auto flex items-center gap-1.5 text-xs hover:text-primary transition-colors cursor-pointer"
              >
                <Share2 className="h-3.5 w-3.5" />
                Share
              </button>
            </div>
          </header>

          {/* Article body */}
          <div
            className="prose-custom"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
          />

          {/* Article footer */}
          <footer className="mt-16 pt-8 border-t border-border">
            <div className="flex items-center justify-between">
              <Link
                href="/blog"
                className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                All articles
              </Link>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: post.title, url: window.location.href });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                  }
                }}
                className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Share2 className="h-4 w-4" />
                Share article
              </button>
            </div>
          </footer>
        </article>
      </div>

      {/* Scroll to top */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-40 h-10 w-10 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      )}
    </>
  );
}
