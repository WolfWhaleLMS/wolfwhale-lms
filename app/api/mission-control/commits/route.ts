import { NextResponse } from "next/server";
import { execSync } from "child_process";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // Require admin auth
  const role = request.headers.get('x-user-role')
  if (role !== 'admin' && role !== 'super_admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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
