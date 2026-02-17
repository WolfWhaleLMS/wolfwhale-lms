"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, type LucideIcon } from "lucide-react";

type GlowColor = "cyan" | "green" | "amber" | "blue";

interface ToolPanelProps {
  title: string;
  icon: LucideIcon;
  accent?: GlowColor;
  defaultCollapsed?: boolean;
  children: React.ReactNode;
}

export function ToolPanel({
  title,
  icon: Icon,
  accent = "cyan",
  defaultCollapsed = false,
  children,
}: ToolPanelProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  const accentColors: Record<GlowColor, string> = {
    cyan: "text-[#00ffff]",
    green: "text-[#33ff33]",
    amber: "text-[#ffbf00]",
    blue: "text-[#00bfff]",
  };

  return (
    <div className={`mc-panel mc-glow-${accent} mc-animate-in`}>
      <div className="mc-panel-header">
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${accentColors[accent]}`} />
          <span className="text-sm font-semibold tracking-wide uppercase">
            {title}
          </span>
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded hover:bg-[#1e293b] transition-colors"
          aria-label={collapsed ? "Expand panel" : "Collapse panel"}
        >
          {collapsed ? (
            <ChevronDown className="h-4 w-4 text-[#64748b]" />
          ) : (
            <ChevronUp className="h-4 w-4 text-[#64748b]" />
          )}
        </button>
      </div>
      {!collapsed && <div className="mc-panel-body">{children}</div>}
    </div>
  );
}
