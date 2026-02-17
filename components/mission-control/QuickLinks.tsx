"use client";

import {
  Github,
  Triangle,
  Database,
  Bug,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";

interface QuickLink {
  label: string;
  href: string;
  icon: LucideIcon;
  color: string;
}

const links: QuickLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/WolfWhaleLMS/wolfwhale-lms",
    icon: Github,
    color: "#e2e8f0",
  },
  {
    label: "Vercel",
    href: "https://vercel.com",
    icon: Triangle,
    color: "#00bfff",
  },
  {
    label: "Supabase",
    href: "https://supabase.com/dashboard",
    icon: Database,
    color: "#33ff33",
  },
  {
    label: "Sentry",
    href: "https://sentry.io",
    icon: Bug,
    color: "#ffbf00",
  },
];

export function QuickLinks() {
  return (
    <div className="grid grid-cols-2 gap-2">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg
            bg-[#0a0e17] border border-[#1e293b] hover:border-[#00ffff30]
            transition-all group"
        >
          <link.icon
            className="h-4 w-4 shrink-0"
            style={{ color: link.color }}
          />
          <span className="text-sm text-[#e2e8f0] truncate">{link.label}</span>
          <ExternalLink className="h-3 w-3 ml-auto text-[#64748b] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
        </a>
      ))}
    </div>
  );
}
