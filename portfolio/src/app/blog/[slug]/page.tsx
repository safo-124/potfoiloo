import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Placeholder — later this will fetch from Prisma
  const post = {
    title: slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
    date: "2025-12-15",
    readTime: "8 min",
    tags: ["DSP", "Python", "Tutorial"],
    content: `
## Introduction

This is a placeholder blog post for **"${slug}"**. When the database is connected, this content will be fetched dynamically from Prisma.

## What You'll Learn

- Foundational concepts and mathematical background
- Practical implementation in Python
- Real-world applications and use cases
- Tips for optimization and best practices

## Code Example

\`\`\`python
import numpy as np

# Example DSP code
def compute_fft(signal, sample_rate):
    """Compute the FFT of a signal."""
    N = len(signal)
    fft_result = np.fft.fft(signal)
    frequencies = np.fft.fftfreq(N, 1/sample_rate)
    magnitude = np.abs(fft_result) / N
    return frequencies[:N//2], magnitude[:N//2]

# Generate a test signal
t = np.linspace(0, 1, 1000)
signal = np.sin(2 * np.pi * 50 * t) + 0.5 * np.sin(2 * np.pi * 120 * t)

freqs, mags = compute_fft(signal, 1000)
\`\`\`

## Conclusion

Stay tuned for the full article! Connect your PostgreSQL database and use the admin panel to write and publish blog posts.
    `,
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
