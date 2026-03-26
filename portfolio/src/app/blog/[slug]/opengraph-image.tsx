import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const alt = "Blog Post";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let post: { title: string; excerpt: string; tags: string[]; createdAt: Date } | null = null;
  try {
    post = await prisma.blogPost.findFirst({
      where: { slug, published: true },
      select: { title: true, excerpt: true, tags: true, createdAt: true },
    });
  } catch {
    /* empty */
  }

  const title = post?.title || "Blog Post";
  const excerpt = post?.excerpt || "";
  const tags = post?.tags || [];

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "60px",
          background: "linear-gradient(135deg, #0a1612 0%, #0f2318 50%, #0a1612 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "8px",
              height: "32px",
              background: "#10b981",
              borderRadius: "4px",
            }}
          />
          <span style={{ color: "#10b981", fontSize: "18px", fontWeight: 600 }}>
            ESA_ Blog
          </span>
        </div>

        {/* Title */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h1
            style={{
              color: "#f1f5f9",
              fontSize: title.length > 60 ? "40px" : "52px",
              fontWeight: 700,
              lineHeight: 1.2,
              maxWidth: "900px",
            }}
          >
            {title}
          </h1>
          {excerpt && (
            <p
              style={{
                color: "#94a3b8",
                fontSize: "22px",
                lineHeight: 1.4,
                maxWidth: "800px",
              }}
            >
              {excerpt.length > 120 ? excerpt.slice(0, 120) + "…" : excerpt}
            </p>
          )}
        </div>

        {/* Bottom: tags + author */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                style={{
                  padding: "6px 16px",
                  borderRadius: "20px",
                  background: "rgba(16, 185, 129, 0.15)",
                  color: "#10b981",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          <span style={{ color: "#64748b", fontSize: "16px" }}>
            Emmanuel Safo Acheampong
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
