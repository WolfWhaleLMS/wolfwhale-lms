"use client";

import { useState, useEffect } from "react";
import {
  X,
  Shield,
  Code2,
  Server,
  Search,
  Gauge,
  Palette,
  Database,
  Cpu,
  Monitor,
  FlaskConical,
  Users,
  type LucideIcon,
} from "lucide-react";

/* ── Agent definitions ─────────────────────────────────── */

interface Agent {
  id: string;
  name: string;
  role: string;
  color: string;
  icon: LucideIcon;
  description: string;
  skills: string[];
  activities: string[];
}

const AGENTS: Agent[] = [
  {
    id: "code-reviewer",
    name: "REX",
    role: "Code Reviewer",
    color: "#00ffff",
    icon: Code2,
    description:
      "Conducts comprehensive code reviews. Catches bugs, enforces SOLID principles, and ensures code quality before merge.",
    skills: ["Code Quality", "Security Scan", "SOLID Patterns", "PR Reviews"],
    activities: [
      "Reviewing PR #42",
      "Scanning imports",
      "Checking types",
      "Linting rules",
    ],
  },
  {
    id: "backend-architect",
    name: "FORGE",
    role: "Backend Architect",
    color: "#ff6b35",
    icon: Server,
    description:
      "Designs APIs, microservice boundaries, and database schemas. Optimizes for scalability and performance.",
    skills: ["API Design", "REST/GraphQL", "Schema Design", "Scaling"],
    activities: [
      "Designing API",
      "Schema review",
      "Optimizing queries",
      "Planning routes",
    ],
  },
  {
    id: "frontend-dev",
    name: "ATLAS",
    role: "Frontend Dev",
    color: "#a855f7",
    icon: Monitor,
    description:
      "Builds React/Next.js frontends with TypeScript, responsive design, and comprehensive testing.",
    skills: ["React/Next.js", "TypeScript", "Tailwind CSS", "Testing"],
    activities: [
      "Building UI",
      "Styling components",
      "Fixing layout",
      "Adding tests",
    ],
  },
  {
    id: "security-auditor",
    name: "SENTINEL",
    role: "Security Auditor",
    color: "#ff4444",
    icon: Shield,
    description:
      "Performs security audits, compliance assessments, and vulnerability analysis across the stack.",
    skills: ["Vuln Analysis", "OWASP Top 10", "Compliance", "Pen Testing"],
    activities: [
      "Scanning vulns",
      "Checking auth",
      "Auditing RLS",
      "Testing CORS",
    ],
  },
  {
    id: "performance-eng",
    name: "TURBO",
    role: "Perf Engineer",
    color: "#ffbf00",
    icon: Gauge,
    description:
      "Profiles applications, optimizes bottlenecks, and implements caching. Handles load testing and query optimization.",
    skills: ["Profiling", "Caching", "Load Testing", "Query Tuning"],
    activities: [
      "Profiling app",
      "Optimizing bundle",
      "Caching layer",
      "Load test #7",
    ],
  },
  {
    id: "devops-eng",
    name: "PIPE",
    role: "DevOps Engineer",
    color: "#33ff33",
    icon: Cpu,
    description:
      "CI/CD specialist. Manages deployment automation, infrastructure provisioning, and monitoring.",
    skills: ["CI/CD", "Docker", "Monitoring", "Cloud Ops"],
    activities: [
      "Building CI",
      "Deploying v2.1",
      "Checking logs",
      "Scaling pods",
    ],
  },
  {
    id: "schema-architect",
    name: "SCHEMA",
    role: "DB Architect",
    color: "#00bfff",
    icon: Database,
    description:
      "Designs Supabase schemas, migration plans, and Row Level Security policies.",
    skills: ["Supabase", "Migrations", "RLS Policies", "Indexing"],
    activities: [
      "Writing migration",
      "Adding index",
      "RLS policy",
      "Schema update",
    ],
  },
  {
    id: "ui-ux-designer",
    name: "PIXEL",
    role: "UI/UX Designer",
    color: "#ff69b4",
    icon: Palette,
    description:
      "Provides research-backed design feedback. Specializes in usability, accessibility, and distinctive design direction.",
    skills: ["Usability", "A11y", "Design Systems", "User Research"],
    activities: [
      "Reviewing layout",
      "A11y check",
      "Color contrast",
      "Design tokens",
    ],
  },
  {
    id: "test-engineer",
    name: "PROBE",
    role: "Test Engineer",
    color: "#84cc16",
    icon: FlaskConical,
    description:
      "Test automation specialist. Builds test strategies, coverage analysis, and CI/CD testing pipelines.",
    skills: ["E2E Tests", "Unit Tests", "Coverage", "CI Testing"],
    activities: [
      "Running suite",
      "Writing e2e",
      "Coverage: 87%",
      "Fixing flaky",
    ],
  },
  {
    id: "explorer",
    name: "SCOUT",
    role: "Explorer",
    color: "#14b8a6",
    icon: Search,
    description:
      "Fast codebase exploration specialist. Finds files, searches code, and maps project architecture.",
    skills: ["Code Search", "File Patterns", "Architecture", "Deep Research"],
    activities: [
      "Scanning files",
      "Mapping deps",
      "Finding refs",
      "Tracing flow",
    ],
  },
];

/* ── Component ─────────────────────────────────────────── */

type Status = "active" | "idle" | "busy";

export function AgentOffice() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activities, setActivities] = useState<Record<string, string>>({});
  const [statuses, setStatuses] = useState<Record<string, Status>>({});

  /* seed initial statuses */
  useEffect(() => {
    const init: Record<string, Status> = {};
    AGENTS.forEach((a) => {
      const r = Math.random();
      init[a.id] = r > 0.55 ? "active" : r > 0.25 ? "busy" : "idle";
    });
    setStatuses(init);
  }, []);

  /* rotate activities + statuses on a timer */
  useEffect(() => {
    const iv = setInterval(() => {
      setActivities((prev) => {
        const next = { ...prev };
        const count = 2 + Math.floor(Math.random() * 2);
        for (let i = 0; i < count; i++) {
          const a = AGENTS[Math.floor(Math.random() * AGENTS.length)];
          next[a.id] =
            a.activities[Math.floor(Math.random() * a.activities.length)];
        }
        return next;
      });

      if (Math.random() > 0.4) {
        setStatuses((prev) => {
          const next = { ...prev };
          const a = AGENTS[Math.floor(Math.random() * AGENTS.length)];
          const opts: Status[] = ["active", "idle", "busy"];
          next[a.id] = opts[Math.floor(Math.random() * opts.length)];
          return next;
        });
      }
    }, 2800);

    return () => clearInterval(iv);
  }, []);

  const selected = selectedId
    ? AGENTS.find((a) => a.id === selectedId) ?? null
    : null;

  const counts = Object.values(statuses);
  const activeCount = counts.filter((s) => s === "active").length;
  const busyCount = counts.filter((s) => s === "busy").length;
  const idleCount = counts.filter((s) => s === "idle").length;

  return (
    <div className="agent-office">
      {/* ── Header ──────────────────────────────── */}
      <div className="office-header">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-[#00ffff]" />
          <span
            className="text-sm font-bold tracking-wider uppercase text-[#e2e8f0]"
            style={{ fontFamily: "var(--font-orbitron), sans-serif" }}
          >
            Agent Floor
          </span>
          <span className="text-[10px] text-[#64748b] ml-1">
            {AGENTS.length} agents
          </span>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-[#64748b]">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#33ff33] inline-block" />
            {activeCount}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffbf00] inline-block" />
            {busyCount}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#475569] inline-block" />
            {idleCount}
          </span>
        </div>
      </div>

      {/* ── Office floor grid ───────────────────── */}
      <div className="office-floor">
        {AGENTS.map((agent, i) => {
          const status = statuses[agent.id] || "idle";
          const activity = activities[agent.id] || agent.activities[0];
          const isSel = selectedId === agent.id;

          return (
            <button
              key={agent.id}
              className={`workstation${isSel ? " workstation-selected" : ""}`}
              onClick={() => setSelectedId(isSel ? null : agent.id)}
              style={
                {
                  animationDelay: `${i * 80}ms`,
                  "--ag": agent.color,
                  "--ag-dim": agent.color + "40",
                  "--ag-bg": agent.color + "15",
                  "--ag-glow": agent.color + "20",
                } as React.CSSProperties
              }
            >
              {/* Status dot */}
              <span className={`ws-status ws-status-${status}`} />

              {/* Monitor */}
              <div className="ws-monitor">
                <div className="ws-screen">
                  <div className="ws-scanline" />
                  <span className="ws-screen-text">{activity}</span>
                </div>
                <div className="ws-monitor-stand" />
              </div>

              {/* Character */}
              <div className="ws-character">
                <div className="ws-char-head">
                  <agent.icon className="w-3.5 h-3.5" />
                </div>
                <div className="ws-char-body" />
              </div>

              {/* Desk */}
              <div className="ws-desk">
                <div className="ws-desk-edge" />
              </div>

              {/* Chair */}
              <div className="ws-chair" />

              {/* Label */}
              <div className="ws-label">
                <span className="ws-name">{agent.name}</span>
                <span className="ws-role">{agent.role}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Detail panel ────────────────────────── */}
      {selected && (
        <div className="agent-detail mc-animate-in">
          <div className="agent-detail-header">
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{
                  background: selected.color + "18",
                  border: `1.5px solid ${selected.color}50`,
                }}
              >
                <selected.icon
                  className="w-4.5 h-4.5"
                  style={{ color: selected.color }}
                />
              </div>
              <div>
                <h3
                  className="text-sm font-bold tracking-wider"
                  style={{ color: selected.color }}
                >
                  {selected.name}
                </h3>
                <p className="text-[10px] text-[#64748b]">{selected.role}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedId(null)}
              className="text-[#64748b] hover:text-[#e2e8f0] transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-[#94a3b8] mb-3 leading-relaxed">
            {selected.description}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {selected.skills.map((skill) => (
              <span
                key={skill}
                className="text-[10px] px-2 py-0.5 rounded-full"
                style={{
                  background: selected.color + "12",
                  color: selected.color,
                  border: `1px solid ${selected.color}30`,
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
