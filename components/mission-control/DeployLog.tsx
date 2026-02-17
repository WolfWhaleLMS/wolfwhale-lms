"use client";

import { useState, useEffect } from "react";

interface Commit {
  hash: string;
  message: string;
  time: string;
  author: string;
}

export function DeployLog() {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/mission-control/commits")
      .then((r) => r.json())
      .then((data) => {
        setCommits(data.commits);
        if (data.error) setError(data.error);
      })
      .catch(() => setError("Failed to fetch commits"));
  }, []);

  if (error && commits.length === 0) {
    return <div className="text-sm text-[#64748b]">{error}</div>;
  }

  if (commits.length === 0) {
    return <div className="text-sm text-[#64748b]">Loading...</div>;
  }

  return (
    <div className="mc-terminal">
      {commits.map((c) => (
        <div key={c.hash} className="flex gap-2 py-0.5">
          <span className="text-[#ffbf00] shrink-0">{c.hash}</span>
          <span className="text-[#e2e8f0] truncate flex-1">{c.message}</span>
          <span className="text-[#64748b] shrink-0 text-xs self-center">
            {c.time}
          </span>
        </div>
      ))}
    </div>
  );
}
