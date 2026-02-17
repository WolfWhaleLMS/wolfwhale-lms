"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const STORAGE_KEY = "mc-scratchpad";

export function Scratchpad() {
  const [value, setValue] = useState("");
  const [saved, setSaved] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setValue(stored);
  }, []);

  const save = useCallback((text: string) => {
    localStorage.setItem(STORAGE_KEY, text);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setValue(text);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => save(text), 800);
  };

  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={handleChange}
        placeholder="Quick notes, TODOs, scratch..."
        className="w-full h-36 bg-[#0a0e17] border border-[#1e293b] rounded-lg p-3
          text-sm text-[#e2e8f0] placeholder-[#475569] resize-none
          focus:outline-none focus:border-[#00ffff40] transition-colors"
        spellCheck={false}
      />
      {saved && (
        <span className="absolute top-2 right-2 text-xs text-[#33ff33] animate-pulse">
          saved
        </span>
      )}
    </div>
  );
}
