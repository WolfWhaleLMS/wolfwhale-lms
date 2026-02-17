"use client";

import { useState, useEffect } from "react";

interface DbData {
  tables: Record<string, number | string>;
  migrationCount: number;
}

export function DatabaseStats() {
  const [data, setData] = useState<DbData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/mission-control/db-stats")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setError(true));
  }, []);

  if (error) {
    return <div className="text-sm text-[#ff4444]">Failed to fetch DB stats</div>;
  }

  if (!data) {
    return <div className="text-sm text-[#64748b]">Loading...</div>;
  }

  const entries = Object.entries(data.tables);

  return (
    <div className="space-y-3">
      <div className="mc-terminal space-y-1">
        {entries.map(([table, count]) => (
          <div key={table} className="flex justify-between text-sm">
            <span className="text-[#64748b]">{table}</span>
            <span
              className={
                count === "err" ? "text-[#ff4444]" : "text-[#e2e8f0]"
              }
            >
              {count === "err" ? "error" : count.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-sm border-t border-[#1e293b] pt-2">
        <span className="text-[#64748b]">Migrations</span>
        <span className="text-[#00ffff]">{data.migrationCount}</span>
      </div>
    </div>
  );
}
