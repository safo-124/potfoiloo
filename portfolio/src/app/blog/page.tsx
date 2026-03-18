import Link from "next/link";
import { ArrowLeft, BookOpen, Sparkles } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { BlogPostList } from "@/components/blog-post-list";

export const revalidate = 60;

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
          <BlogPostList posts={posts} />
        )}
      </div>
    </div>
  );
}
