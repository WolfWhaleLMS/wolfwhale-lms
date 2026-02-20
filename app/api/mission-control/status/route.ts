import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  // Real Supabase auth — verify session + admin role via tenant_memberships
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: membership } = await supabase
    .from("tenant_memberships")
    .select("role")
    .eq("user_id", user.id)
    .in("role", ["admin", "super_admin"])
    .limit(1)
    .single();

  if (!membership) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
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
