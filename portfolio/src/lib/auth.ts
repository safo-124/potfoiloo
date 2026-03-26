import { createHmac } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const COOKIE_NAME = "admin-token";
const HMAC_SECRET = "portfolio-session-secret-v1";

function getSecret(): string {
  return process.env.ADMIN_PASSWORD || "";
}

export function generateSessionToken(): string {
  return createHmac("sha256", HMAC_SECRET)
    .update(getSecret())
    .digest("hex")
    .slice(0, 32);
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token || !getSecret()) return false;
  return token === generateSessionToken();
}

export async function requireAuth(): Promise<NextResponse | null> {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export { COOKIE_NAME };
