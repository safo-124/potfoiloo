import { prisma } from "@/lib/prisma";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const base = "https://portfoilo-two-ivory.vercel.app";

  let posts: { title: string; slug: string; excerpt: string; tags: string[]; createdAt: Date }[] = [];
  try {
    posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: { title: true, slug: true, excerpt: true, tags: true, createdAt: true },
    });
  } catch {
    /* empty */
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Emmanuel Safo Acheampong — Blog</title>
    <description>Technical articles on signal processing, machine learning, software engineering, and more.</description>
    <link>${base}/blog</link>
    <atom:link href="${base}/api/rss" rel="self" type="application/rss+xml"/>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>Next.js</generator>
${posts
  .map(
    (post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${base}/blog/${encodeURIComponent(post.slug)}</link>
      <description>${escapeXml(post.excerpt)}</description>
      <pubDate>${post.createdAt.toUTCString()}</pubDate>
      <guid isPermaLink="true">${base}/blog/${encodeURIComponent(post.slug)}</guid>
      ${post.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join("\n      ")}
      <dc:creator>Emmanuel Safo Acheampong</dc:creator>
    </item>`
  )
  .join("\n")}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
