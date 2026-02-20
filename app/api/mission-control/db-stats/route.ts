import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { readdirSync } from "fs";
import { join } from "path";

export const dynamic = "force-dynamic";

const TABLES = [
  "tenants",
  "profiles",
  "courses",
  "enrollments",
  "assignments",
  "submissions",
  "grades",
  "lessons",
  "modules",
  "attendance",
  "announcements",
];

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

  const admin = createAdminClient();
  const tableCounts: Record<string, number | string> = {};

  await Promise.all(
    TABLES.map(async (table) => {
      try {
        const { count, error } = await admin
          .from(table)
          .select("*", { count: "exact", head: true });
        tableCounts[table] = error ? "err" : (count ?? 0);
      } catch {
        tableCounts[table] = "err";
      }
    }),
  );

  let migrationCount = 0;
  try {
    const migrationsDir = join(process.cwd(), "supabase", "migrations");
    const files = readdirSync(migrationsDir).filter((f) => f.endsWith(".sql"));
    migrationCount = files.length;
  } catch {
    // migrations dir may not exist in production
  }

  return NextResponse.json({
    tables: tableCounts,
    migrationCount,
    timestamp: new Date().toISOString(),
  });
}
