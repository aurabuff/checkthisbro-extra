"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button type="button" className="theme-btn" aria-label="Toggle theme">
        🌙
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="theme-btn"
      aria-label="Toggle theme"
      id="theme-toggle-btn"
    >
      {resolvedTheme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
