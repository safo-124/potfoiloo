import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, Clock, Eye, BookOpen, Sparkles } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  let dbPosts: Awaited<ReturnType<typeof prisma.blogPost.findMany>> = [];
  try {
    dbPosts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    /* empty */
  }

  const posts = dbPosts.map((p) => ({
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    tags: p.tags,
    views: p.views,
    date: p.createdAt.toISOString().split("T")[0],
    readTime: `${Math.max(1, Math.round(p.content.length / 1000))} min`,
  }));

  const featured = posts[0] ?? null;
  const rest = posts.slice(1);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold">Blog</h1>
            </div>
          </div>
          <p className="text-muted-foreground max-w-xl">
            Technical articles on signal processing, machine learning, software
            engineering, and more.
          </p>
          {posts.length > 0 && (
            <p className="text-xs text-muted-foreground/60 mt-2 font-mono">
              {posts.length} article{posts.length !== 1 ? "s" : ""} published
            </p>
          )}
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-border rounded-xl">
            <Sparkles className="h-10 w-10 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-muted-foreground font-medium">
              No blog posts published yet.
            </p>
            <p className="text-sm text-muted-foreground/60 mt-1">
              Check back soon!
            </p>
          </div>
        ) : (
          <>
            {/* Featured Post Hero */}
            {featured && (
              <Link href={`/blog/${featured.slug}`} className="block group mb-12">
                <article className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 sm:p-10 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
                  {/* Gradient accent */}
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

                  <div className="flex items-center justify-between">
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
      </div>
    </div>
  );
}
