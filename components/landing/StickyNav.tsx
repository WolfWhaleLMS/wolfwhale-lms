"use client";

import { useState, useEffect, useCallback } from "react";

interface StickyNavProps {
  items: { label: string; href: string }[];
}

export default function StickyNav({ items }: StickyNavProps) {
  const [visible, setVisible] = useState(false);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 500);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = items.map((i) => i.href.replace("#", ""));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    },
    []
  );

  return (
    <nav
      className={[
        "fixed top-0 left-0 right-0 z-50 transition-opacity duration-300",
        "bg-white/80 dark:bg-black/80 backdrop-blur-lg",
        "border-b border-gray-200/50 dark:border-white/5",
        visible ? "opacity-100" : "opacity-0 pointer-events-none",
      ].join(" ")}
    >
      <div className="mx-auto max-w-7xl overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1.5 px-4 h-10">
          {items.map(({ label, href }) => {
            const isActive = activeId === href.replace("#", "");
            return (
              <a
                key={href}
                href={href}
                onClick={(e) => handleClick(e, href)}
                className={[
                  "shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap",
                  isActive
                    ? "bg-gray-900 dark:bg-white text-white dark:text-black"
                    : "text-gray-500 dark:text-white/50 hover:text-gray-700 dark:hover:text-white/70",
                ].join(" ")}
              >
                {label}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
