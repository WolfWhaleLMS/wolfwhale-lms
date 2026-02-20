import { NextResponse } from "next/server";
import { execSync } from "child_process";
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
  try {
    const raw = execSync(
      'git log --oneline --pretty=format:"%h|%s|%cr|%an" -15',
      { timeout: 5000, encoding: "utf-8" },
    );

    const commits = raw
      .trim()
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const [hash, message, time, author] = line.split("|");
        return { hash, message, time, author };
      });

    return NextResponse.json({ commits });
  } catch {
    return NextResponse.json({
      commits: [],
      error: "Git not available in this environment",
    });
  }
}
