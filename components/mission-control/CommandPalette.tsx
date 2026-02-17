"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Activity,
  Github,
  Database,
  Triangle,
  Bug,
  Home,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";

interface Command {
  id: string;
  label: string;
  icon: LucideIcon;
  action: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Command[] = [
    {
      id: "home",
      label: "Go to Dashboard",
      icon: Home,
      action: () => (window.location.href = "/"),
    },
    {
      id: "github",
      label: "Open GitHub",
      icon: Github,
      action: () =>
        window.open(
          "https://github.com/WolfWhaleLMS/wolfwhale-lms",
          "_blank",
        ),
    },
    {
      id: "vercel",
      label: "Open Vercel",
      icon: Triangle,
      action: () => window.open("https://vercel.com", "_blank"),
    },
    {
      id: "supabase",
      label: "Open Supabase",
      icon: Database,
      action: () =>
        window.open("https://supabase.com/dashboard", "_blank"),
    },
    {
      id: "sentry",
      label: "Open Sentry",
      icon: Bug,
      action: () => window.open("https://sentry.io", "_blank"),
    },
    {
      id: "health",
      label: "Check API Health",
      icon: Activity,
      action: () => window.open("/api/health", "_blank"),
    },
    {
      id: "reload",
      label: "Reload Page",
      icon: RefreshCw,
      action: () => window.location.reload(),
    },
  ];

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase()),
  );

  const execute = useCallback(
    (cmd: Command) => {
      onClose();
      setQuery("");
      cmd.action();
    },
    [onClose],
  );

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && filtered[activeIndex]) {
      execute(filtered[activeIndex]);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="mc-cmd-overlay" onClick={onClose}>
      <div
        className="mc-cmd-box mc-animate-in"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a command..."
          className="mc-cmd-input"
        />
        <div className="py-2 max-h-72 overflow-y-auto">
          {filtered.length === 0 && (
            <div className="px-5 py-3 text-sm text-[#64748b]">
              No commands found
            </div>
          )}
          {filtered.map((cmd, i) => (
            <div
              key={cmd.id}
              data-active={i === activeIndex}
              className="mc-cmd-item"
              onClick={() => execute(cmd)}
              onMouseEnter={() => setActiveIndex(i)}
            >
              <cmd.icon className="h-4 w-4 text-[#64748b]" />
              <span className="text-sm text-[#e2e8f0]">{cmd.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
