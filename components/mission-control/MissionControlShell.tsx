"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Activity,
  Link2,
  GitCommit,
  Database,
  StickyNote,
  Command,
} from "lucide-react";

import { ToolPanel } from "./ToolPanel";
import { SystemStatus } from "./SystemStatus";
import { QuickLinks } from "./QuickLinks";
import { DeployLog } from "./DeployLog";
import { DatabaseStats } from "./DatabaseStats";
import { Scratchpad } from "./Scratchpad";
import { CommandPalette } from "./CommandPalette";
import { AgentOffice } from "./AgentOffice";

function Clock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="text-[#00ffff] text-lg tracking-widest">{time}</span>
  );
}

export function MissionControlShell() {
  const [cmdOpen, setCmdOpen] = useState(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      }
    },
    [],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="min-h-screen p-4 md:p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between mb-6 pb-4 border-b border-[#1e293b]">
        <div>
          <h1
            className="text-xl font-bold tracking-wider uppercase"
            style={{ fontFamily: "var(--font-orbitron), sans-serif" }}
          >
            Mission Control
          </h1>
          <p className="text-xs text-[#64748b] mt-0.5">
            WolfWhale Dev Hub
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCmdOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5
              text-xs text-[#64748b] border border-[#1e293b] rounded-md
              hover:border-[#00ffff30] hover:text-[#e2e8f0] transition-colors"
          >
            <Command className="h-3 w-3" />
            <span>K</span>
          </button>
          <Clock />
        </div>
      </header>

      {/* Agent Office — full-width game visualization */}
      <AgentOffice />

      {/* Panel Grid */}
      <div className="mc-grid mt-4">
        <ToolPanel title="System Status" icon={Activity} accent="green">
          <SystemStatus />
        </ToolPanel>

        <ToolPanel title="Quick Links" icon={Link2} accent="blue">
          <QuickLinks />
        </ToolPanel>

        <ToolPanel title="Deploy Log" icon={GitCommit} accent="amber">
          <DeployLog />
        </ToolPanel>

        <ToolPanel title="Database" icon={Database} accent="cyan">
          <DatabaseStats />
        </ToolPanel>

        <ToolPanel title="Scratchpad" icon={StickyNote} accent="green">
          <Scratchpad />
        </ToolPanel>
      </div>

      {/* Command Palette */}
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
    </div>
  );
}
