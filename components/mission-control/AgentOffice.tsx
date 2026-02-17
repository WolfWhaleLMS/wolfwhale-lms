"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  Clock,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";

/* ── Types ───────────────────────────────────────────── */

type Status = "active" | "idle" | "busy";

interface Task {
  label: string;
  progress: number; /* 0–100 */
  startedAt: number; /* timestamp ms */
}

interface AgentDef {
  id: string;
  name: string;
  role: string;
  color: string;
  icon: LucideIcon;
  description: string;
  skills: string[];
  taskPool: string[]; /* pool of possible tasks */
}

interface AgentState {
  status: Status;
  currentTask: Task;
  completedCount: number;
}

/* ── Agent definitions ─────────────────────────────────── */

const AGENTS: AgentDef[] = [
  {
    id: "code-reviewer",
    name: "REX",
    role: "Code Reviewer",
    color: "#00ffff",
    icon: Code2,
    description:
      "Conducts comprehensive code reviews. Catches bugs, enforces SOLID principles, and ensures code quality before merge.",
    skills: ["Code Quality", "Security Scan", "SOLID Patterns", "PR Reviews"],
    taskPool: [
      "Reviewing PR #42 — auth refactor",
      "Scanning import cycles in /lib",
      "Type-checking new API routes",
      "Linting mission-control module",
      "Reviewing dashboard components",
      "Checking error boundary coverage",
      "Auditing server action types",
      "Reviewing Supabase client usage",
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
    taskPool: [
      "Designing /api/reports endpoint",
      "Schema review for pixel_pets",
      "Optimizing dashboard queries",
      "Planning REST route structure",
      "Evaluating caching strategy",
      "Designing webhook system",
      "API rate-limit architecture",
      "Planning data export pipeline",
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
    taskPool: [
      "Building Mission Control UI",
      "Styling agent floor grid",
      "Fixing mobile layout breakpoints",
      "Adding progress bar animations",
      "Implementing command palette",
      "Building hub screen buttons",
      "Responsive sidebar navigation",
      "Dark theme token system",
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
    taskPool: [
      "Scanning XSS vectors in forms",
      "Auditing RLS policies",
      "Checking auth token flow",
      "Testing CORS configuration",
      "Reviewing API input validation",
      "FERPA compliance scan",
      "Checking session management",
      "Auditing file upload paths",
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
    taskPool: [
      "Profiling dashboard load time",
      "Optimizing bundle size — 340kB",
      "Implementing edge caching",
      "Load test: 500 concurrent users",
      "Analyzing Supabase query plans",
      "Lazy-loading heavy components",
      "Image optimization audit",
      "Measuring TTFB on /student",
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
    taskPool: [
      "Building CI pipeline v2.1",
      "Deploying to Vercel production",
      "Checking Sentry error logs",
      "Configuring preview deploys",
      "Setting up health monitors",
      "Optimizing build cache",
      "Reviewing Vercel edge config",
      "Setting up deploy webhooks",
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
    taskPool: [
      "Writing migration: pixel_pets",
      "Adding index on enrollments",
      "RLS policy for announcements",
      "Schema update: user_profiles",
      "Planning grade_items migration",
      "Optimizing join on courses",
      "Reviewing foreign key cascade",
      "Designing attendance schema",
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
    taskPool: [
      "Reviewing hub button layout",
      "A11y audit: contrast ratios",
      "Color system token review",
      "Design critique: agent floor",
      "Mobile navigation patterns",
      "Typography scale refinement",
      "Icon consistency check",
      "Touch target size audit",
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
    taskPool: [
      "Running full test suite",
      "Writing e2e: login flow",
      "Coverage analysis: 87% -> 92%",
      "Fixing flaky calendar test",
      "Integration test: messaging",
      "Testing offline sync logic",
      "API route smoke tests",
      "Snapshot tests: dashboard",
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
    taskPool: [
      "Scanning 284 source files",
      "Mapping dependency graph",
      "Finding unused exports",
      "Tracing auth middleware flow",
      "Indexing component tree",
      "Searching for TODO markers",
      "Analyzing import patterns",
      "Documenting API endpoints",
    ],
  },
];

/* ── Helpers ──────────────────────────────────────────── */

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function formatElapsed(ms: number): string {
  const sec = Math.floor(ms / 1000);
  if (sec < 60) return `${sec}s`;
  const min = Math.floor(sec / 60);
  const remSec = sec % 60;
  return `${min}m ${remSec}s`;
}

function newTask(agent: AgentDef): Task {
  return {
    label: pickRandom(agent.taskPool),
    progress: 0,
    startedAt: Date.now(),
  };
}

/* ── Component ─────────────────────────────────────────── */

export function AgentOffice() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [agents, setAgents] = useState<Record<string, AgentState>>({});
  const [now, setNow] = useState(Date.now());
  const initialized = useRef(false);

  /* seed initial states */
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const init: Record<string, AgentState> = {};
    AGENTS.forEach((a) => {
      const r = Math.random();
      const status: Status = r > 0.55 ? "active" : r > 0.25 ? "busy" : "idle";
      init[a.id] = {
        status,
        currentTask: {
          label: pickRandom(a.taskPool),
          progress: Math.floor(randomBetween(5, 65)),
          startedAt: Date.now() - randomBetween(5000, 120000),
        },
        completedCount: Math.floor(randomBetween(2, 18)),
      };
    });
    setAgents(init);
  }, []);

  /* tick: advance progress, cycle tasks, shift statuses */
  useEffect(() => {
    const iv = setInterval(() => {
      setNow(Date.now());
      setAgents((prev) => {
        const next = { ...prev };

        AGENTS.forEach((def) => {
          const state = next[def.id];
          if (!state) return;
          const copy = { ...state, currentTask: { ...state.currentTask } };

          if (copy.status === "idle") {
            /* idle agents occasionally wake up */
            if (Math.random() > 0.85) {
              copy.status = "active";
              copy.currentTask = newTask(def);
            }
          } else {
            /* advance progress */
            const rate =
              copy.status === "active"
                ? randomBetween(1.5, 4.5)
                : randomBetween(0.5, 2);
            copy.currentTask.progress = Math.min(
              100,
              copy.currentTask.progress + rate,
            );

            /* task complete? */
            if (copy.currentTask.progress >= 100) {
              copy.completedCount += 1;
              /* brief idle then new task */
              if (Math.random() > 0.3) {
                copy.currentTask = newTask(def);
                copy.status = Math.random() > 0.4 ? "active" : "busy";
              } else {
                copy.status = "idle";
                copy.currentTask = {
                  ...copy.currentTask,
                  label: "Awaiting assignment",
                  progress: 0,
                };
              }
            }
          }

          /* random status jitter */
          if (Math.random() > 0.95 && copy.status !== "idle") {
            copy.status = copy.status === "active" ? "busy" : "active";
          }

          next[def.id] = copy;
        });

        return next;
      });
    }, 800);

    return () => clearInterval(iv);
  }, []);

  const selected = selectedId
    ? AGENTS.find((a) => a.id === selectedId) ?? null
    : null;
  const selectedState = selectedId ? agents[selectedId] : null;

  /* header counts */
  const states = Object.values(agents);
  const activeCount = states.filter((s) => s.status === "active").length;
  const busyCount = states.filter((s) => s.status === "busy").length;
  const idleCount = states.filter((s) => s.status === "idle").length;
  const totalCompleted = states.reduce((s, a) => s + a.completedCount, 0);

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
            <CheckCircle2 className="w-3 h-3 text-[#33ff33]" />
            {totalCompleted} done
          </span>
          <span className="text-[#1e293b]">|</span>
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
          const state = agents[agent.id];
          const status = state?.status || "idle";
          const task = state?.currentTask;
          const activity = task?.label || agent.taskPool[0];
          const progress = task?.progress ?? 0;
          const elapsed = task ? now - task.startedAt : 0;
          const completed = state?.completedCount ?? 0;
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
              <div
                className={`ws-character${status === "idle" ? " ws-char-idle" : ""}`}
              >
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

              {/* Progress bar */}
              <div className="ws-progress-track">
                <div
                  className={`ws-progress-fill ws-progress-${status}`}
                  style={{ width: `${Math.round(progress)}%` }}
                />
              </div>

              {/* Label + info */}
              <div className="ws-label">
                <span className="ws-name">{agent.name}</span>
                <span className="ws-role">{agent.role}</span>
                <span className="ws-meta">
                  {status === "idle" ? (
                    "idle"
                  ) : (
                    <>
                      {Math.round(progress)}%
                      <span className="ws-elapsed">
                        {formatElapsed(elapsed)}
                      </span>
                    </>
                  )}
                </span>
              </div>

              {/* Completed badge */}
              {completed > 0 && (
                <span className="ws-completed-badge">{completed}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Detail panel ────────────────────────── */}
      {selected && selectedState && (
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
            <div className="flex items-center gap-3">
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full border ws-status-badge-${selectedState.status}`}
              >
                {selectedState.status.toUpperCase()}
              </span>
              <button
                onClick={() => setSelectedId(null)}
                className="text-[#64748b] hover:text-[#e2e8f0] transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <p className="text-xs text-[#94a3b8] mb-3 leading-relaxed">
            {selected.description}
          </p>

          {/* Current task detail */}
          <div
            className="mb-3 p-2.5 rounded-lg"
            style={{
              background: selected.color + "08",
              border: `1px solid ${selected.color}20`,
            }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-[#64748b] uppercase tracking-wider">
                Current Task
              </span>
              <div className="flex items-center gap-2 text-[10px] text-[#64748b]">
                <Clock className="w-3 h-3" />
                {formatElapsed(now - selectedState.currentTask.startedAt)}
              </div>
            </div>
            <p
              className="text-xs mb-2"
              style={{ color: selected.color + "cc" }}
            >
              {selectedState.currentTask.label}
            </p>
            <div className="ws-detail-progress-track">
              <div
                className={`ws-detail-progress-fill ws-progress-${selectedState.status}`}
                style={{
                  width: `${Math.round(selectedState.currentTask.progress)}%`,
                }}
              />
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[10px] text-[#64748b]">
                {Math.round(selectedState.currentTask.progress)}% complete
              </span>
              <span className="text-[10px] text-[#64748b]">
                <CheckCircle2 className="w-3 h-3 inline mr-0.5 -mt-px" />
                {selectedState.completedCount} tasks done
              </span>
            </div>
          </div>

          {/* Skills */}
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
