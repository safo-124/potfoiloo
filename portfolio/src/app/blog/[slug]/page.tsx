import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let dbPost;
  try {
    dbPost = await prisma.blogPost.findUnique({ where: { slug } });
    if (dbPost) {
      await prisma.blogPost.update({ where: { slug }, data: { views: { increment: 1 } } });
    }
  } catch { dbPost = null; }

  const post = dbPost ? {
    title: dbPost.title,
    date: dbPost.createdAt.toISOString().split("T")[0],
    readTime: `${Math.max(1, Math.round(dbPost.content.length / 1000))} min`,
    tags: dbPost.tags,
    content: dbPost.content,
  } : {
    title: slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
    date: "2025-12-15",
    readTime: "8 min",
    tags: ["DSP", "Python", "Tutorial"],
    content: `## Introduction\n\nThis is a placeholder blog post for **"${slug}"**. When the database is connected, this content will be fetched dynamically from Prisma.\n\n## What You'll Learn\n\n- Foundational concepts and mathematical background\n- Practical implementation in Python\n- Real-world applications and use cases\n\n## Conclusion\n\nConnect your PostgreSQL database and use the admin panel to write and publish blog posts.`,
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <article className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to blog
        </Link>

        <header className="mb-12">
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
            <span className="font-mono">
              {new Date(post.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {post.readTime}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </header>

        {/* Render markdown content as HTML — in production use a proper markdown renderer */}
        <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground prose-code:text-primary">
          <div
            dangerouslySetInnerHTML={{
              __html: post.content
                .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold mt-10 mb-4">$1</h2>')
                .replace(/^- (.+)$/gm, '<li class="text-muted-foreground">$1</li>')
                .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                .replace(/```python\n([\s\S]*?)```/g, '<pre class="bg-muted rounded-lg p-4 overflow-x-auto my-6"><code class="text-sm font-mono">$1</code></pre>')
                .replace(/\n\n/g, '</p><p class="text-muted-foreground leading-relaxed mb-4">')
            }}
          />
        </div>
      </article>
    </div>
  );
}
