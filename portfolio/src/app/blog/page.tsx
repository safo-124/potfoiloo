import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  let dbPosts: Awaited<ReturnType<typeof prisma.blogPost.findMany>> = [];
  try {
    dbPosts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    });
  } catch { /* empty */ }

  // Map DB posts to display format — no fallback
  const posts = dbPosts.map(p => ({
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    tags: p.tags,
    date: p.createdAt.toISOString().split("T")[0],
    readTime: `${Math.max(1, Math.round(p.content.length / 1000))} min`,
  }));

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <h1 className="text-4xl font-bold mb-2">Blog</h1>
        <p className="text-muted-foreground mb-12">
          Technical articles on signal processing, machine learning, and more.
        </p>

        {posts.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No blog posts published yet. Check back soon!</p>
        ) : (
        <div className="space-y-8">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <article className="group p-6 rounded-lg border border-border hover:border-primary/50 bg-card transition-all">
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3 font-mono">
                  <span>
                    {new Date(post.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span>·</span>
                  <span>{post.readTime} read</span>
                </div>
                <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p className="text-muted-foreground mb-3">{post.excerpt}</p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            </Link>
          ))}
        </div>
        )}
      </div>
    </div>
  );
}
