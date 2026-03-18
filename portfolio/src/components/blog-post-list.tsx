"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  Clock,
  Eye,
  Search,
  X,
} from "lucide-react";

interface Post {
  title: string;
  slug: string;
  excerpt: string;
  tags: string[];
  views: number;
  date: string;
  readTime: string;
}

export function BlogPostList({ posts }: { posts: Post[] }) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Collect all unique tags
  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags))).sort();

  // Filter
  const filtered = posts.filter((p) => {
    const matchesTag = !activeTag || p.tags.includes(activeTag);
    const matchesSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchesTag && matchesSearch;
  });

  const featured = filtered[0] ?? null;
  const rest = filtered.slice(1);

  return (
    <>
      {/* Search + Tag filters */}
      <div className="mb-8 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:border-primary/50 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Tag pills */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTag(null)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all cursor-pointer ${
                !activeTag
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all cursor-pointer ${
                  activeTag === tag
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-xl">
          <p className="text-muted-foreground font-medium">
            No articles match your search.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setActiveTag(null);
            }}
            className="text-sm text-primary hover:underline mt-2 cursor-pointer"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          {/* Featured Post Hero */}
          {featured && (
            <Link
              href={`/blog/${featured.slug}`}
              className="block group mb-12"
            >
              <article className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 sm:p-10 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/80 via-primary to-primary/80" />

                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                    Latest
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4 font-mono">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(featured.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {featured.readTime} read
                  </span>
                  {featured.views > 0 && (
                    <span className="flex items-center gap-1.5">
                      <Eye className="h-3.5 w-3.5" />
                      {featured.views} views
                    </span>
                  )}
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold mb-3 group-hover:text-primary transition-colors leading-tight">
                  {featured.title}
                </h2>

                <p className="text-muted-foreground leading-relaxed mb-6 max-w-2xl">
                  {featured.excerpt}
                </p>

                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex flex-wrap gap-2">
                    {featured.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-3 py-1 rounded-full bg-secondary text-secondary-foreground font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-primary font-medium inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                    Read article
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </article>
            </Link>
          )}

          {/* Remaining Posts Grid */}
          {rest.length > 0 && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground/60 font-mono uppercase tracking-widest">
                  More Articles
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {rest.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="block group"
                  >
                    <article className="h-full rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-md hover:shadow-primary/5">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3 font-mono">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3 w-3" />
                          {new Date(post.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3 w-3" />
                          {post.readTime}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {post.excerpt}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[11px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
