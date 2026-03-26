import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { logger } from "@/lib/logger";

function parseDevice(ua: string): string {
  if (/mobile|android|iphone|ipod/i.test(ua)) return "mobile";
  if (/ipad|tablet/i.test(ua)) return "tablet";
  return "desktop";
}

function parseBrowser(ua: string): string {
  if (/edg\//i.test(ua)) return "Edge";
  if (/chrome|crios/i.test(ua)) return "Chrome";
  if (/firefox|fxios/i.test(ua)) return "Firefox";
  if (/safari/i.test(ua) && !/chrome/i.test(ua)) return "Safari";
  if (/opera|opr/i.test(ua)) return "Opera";
  return "Other";
}

function parseOS(ua: string): string {
  if (/windows/i.test(ua)) return "Windows";
  if (/mac os|macintosh/i.test(ua)) return "macOS";
  if (/linux/i.test(ua) && !/android/i.test(ua)) return "Linux";
  if (/android/i.test(ua)) return "Android";
  if (/iphone|ipad|ipod/i.test(ua)) return "iOS";
  return "Other";
}

// POST — record a page view
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const path = typeof body.path === "string" ? body.path.slice(0, 500) : "/";
    const referrer = typeof body.referrer === "string" ? body.referrer.slice(0, 1000) : null;

    const ua = request.headers.get("user-agent") || "";

    await prisma.pageView.create({
      data: {
        path,
        referrer: referrer || null,
        userAgent: ua.slice(0, 500),
        device: parseDevice(ua),
        browser: parseBrowser(ua),
        os: parseOS(ua),
        country: request.headers.get("x-vercel-ip-country") || null,
      },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    logger.error("analytics", "Failed to record page view", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

// GET — retrieve analytics data (for admin)
export async function GET(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "30", 10);
    const since = new Date();
    since.setDate(since.getDate() - days);

    const [totalViews, views, topPages, devices, browsers, oses, countries] = await Promise.all([
      prisma.pageView.count({ where: { createdAt: { gte: since } } }),
      // Views per day
      prisma.$queryRawUnsafe<{ date: string; count: bigint }[]>(
        `SELECT DATE("createdAt") as date, COUNT(*)::bigint as count FROM "PageView" WHERE "createdAt" >= $1 GROUP BY DATE("createdAt") ORDER BY date ASC`,
        since
      ),
      // Top pages
      prisma.$queryRawUnsafe<{ path: string; count: bigint }[]>(
        `SELECT "path", COUNT(*)::bigint as count FROM "PageView" WHERE "createdAt" >= $1 GROUP BY "path" ORDER BY count DESC LIMIT 10`,
        since
      ),
      // Devices
      prisma.$queryRawUnsafe<{ device: string; count: bigint }[]>(
        `SELECT COALESCE("device", 'unknown') as device, COUNT(*)::bigint as count FROM "PageView" WHERE "createdAt" >= $1 GROUP BY "device" ORDER BY count DESC`,
        since
      ),
      // Browsers
      prisma.$queryRawUnsafe<{ browser: string; count: bigint }[]>(
        `SELECT COALESCE("browser", 'unknown') as browser, COUNT(*)::bigint as count FROM "PageView" WHERE "createdAt" >= $1 GROUP BY "browser" ORDER BY count DESC`,
        since
      ),
      // OS
      prisma.$queryRawUnsafe<{ os: string; count: bigint }[]>(
        `SELECT COALESCE("os", 'unknown') as os, COUNT(*)::bigint as count FROM "PageView" WHERE "createdAt" >= $1 GROUP BY "os" ORDER BY count DESC`,
        since
      ),
      // Countries
      prisma.$queryRawUnsafe<{ country: string; count: bigint }[]>(
        `SELECT COALESCE("country", 'unknown') as country, COUNT(*)::bigint as count FROM "PageView" WHERE "createdAt" >= $1 GROUP BY "country" ORDER BY count DESC LIMIT 10`,
        since
      ),
    ]);

    // Recent views
    const recentViews = await prisma.pageView.findMany({
      where: { createdAt: { gte: since } },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: { id: true, path: true, device: true, browser: true, os: true, country: true, referrer: true, createdAt: true },
    });

    // CV Downloads (non-fatal — don't break analytics if table is missing)
    let cvDownloadCount = 0;
    let cvDownloads: { id: string; device: string | null; browser: string | null; os: string | null; country: string | null; referrer: string | null; createdAt: Date }[] = [];
    try {
      [cvDownloadCount, cvDownloads] = await Promise.all([
        prisma.cvDownload.count({ where: { createdAt: { gte: since } } }),
        prisma.cvDownload.findMany({
          where: { createdAt: { gte: since } },
          orderBy: { createdAt: "desc" },
          take: 20,
          select: { id: true, device: true, browser: true, os: true, country: true, referrer: true, createdAt: true },
        }),
      ]);
    } catch (e) {
      logger.error("analytics", "Failed to fetch CV downloads", e);
    }

    // Convert BigInt to Number for JSON serialization
    const toNum = (rows: { count: bigint }[]) => rows.map(r => ({ ...r, count: Number(r.count) }));

    return NextResponse.json({
      totalViews,
      viewsPerDay: toNum(views),
      topPages: toNum(topPages),
      devices: toNum(devices),
      browsers: toNum(browsers),
      oses: toNum(oses),
      countries: toNum(countries),
      recentViews,
      cvDownloads: cvDownloadCount,
      recentCvDownloads: cvDownloads,
    });
  } catch (error) {
    logger.error("analytics", "Failed to fetch analytics", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
