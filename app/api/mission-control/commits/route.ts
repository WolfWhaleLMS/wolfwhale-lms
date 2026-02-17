import { NextResponse } from "next/server";
import { execSync } from "child_process";

export const dynamic = "force-dynamic";

export async function GET() {
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
