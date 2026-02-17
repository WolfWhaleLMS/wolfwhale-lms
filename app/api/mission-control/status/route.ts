import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const healthUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/health`;

  let healthData = null;
  try {
    const res = await fetch(healthUrl, { cache: "no-store" });
    healthData = await res.json();
  } catch {
    healthData = { status: "unreachable" };
  }

  return NextResponse.json({
    health: healthData,
    node: process.version,
    env: process.env.NODE_ENV,
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
}
