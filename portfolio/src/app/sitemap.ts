import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://portfoilo-two-ivory.vercel.app";

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/projects`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/publications`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.6 },
  ];

  let blogPages: MetadataRoute.Sitemap = [];
  let projectPages: MetadataRoute.Sitemap = [];

  try {
    const [posts, projects] = await Promise.all([
      prisma.blogPost.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
      prisma.project.findMany({ select: { slug: true, updatedAt: true } }),
    ]);

    blogPages = posts.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

    projectPages = projects.map((p) => ({
      url: `${base}/projects/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {
    /* empty */
  }

  return [...staticPages, ...blogPages, ...projectPages];
}
