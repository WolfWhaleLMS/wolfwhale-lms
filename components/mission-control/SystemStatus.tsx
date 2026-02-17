"use client";

import { useState, useEffect, useCallback } from "react";

interface StatusData {
  health: {
    status: string;
    latency?: number;
    checks?: Record<string, { status: string; latency?: number }>;
  };
  node: string;
  env: string;
  uptime: number;
  timestamp: string;
}

function formatUptime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}h ${m}m ${s}s`;
}

export function SystemStatus() {
  const [data, setData] = useState<StatusData | null>(null);
  const [error, setError] = useState(false);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/mission-control/status");
      if (!res.ok) throw new Error();
      setData(await res.json());
      setError(false);
    } catch {
      setError(true);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30_000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  if (error) {
    return (
      <div className="text-sm text-[#ff4444]">Failed to fetch status</div>
    );
  }

  if (!data) {
    return <div className="text-sm text-[#64748b]">Loading...</div>;
  }

  const statusColor =
    data.health.status === "healthy"
      ? "mc-status-healthy"
      : data.health.status === "degraded"
        ? "mc-status-degraded"
        : "mc-status-unhealthy";

  const rows = [
    { label: "API", value: data.health.status, dot: statusColor },
    {
      label: "DB",
      value: data.health.checks?.database?.status ?? "unknown",
      dot: data.health.checks?.database?.status === "healthy"
        ? "mc-status-healthy"
        : "mc-status-unhealthy",
    },
    { label: "Node", value: data.node },
    { label: "Env", value: data.env },
    { label: "Uptime", value: formatUptime(data.uptime) },
    {
      label: "Latency",
      value: data.health.latency ? `${data.health.latency}ms` : "N/A",
    },
  ];

  return (
    <div className="space-y-2">
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex items-center justify-between text-sm"
        >
          <span className="text-[#64748b]">{row.label}</span>
          <div className="flex items-center gap-2">
            {"dot" in row && row.dot && (
              <span className={`mc-status-dot ${row.dot}`} />
            )}
            <span className="text-[#e2e8f0]">{row.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
