"use client";

import { useEffect, useState } from "react";
import { Icon } from "./icons";

type Theme = "light" | "dark" | "system";

function resolve(theme: Theme): "light" | "dark" {
  if (theme !== "system") return theme;
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolved, setResolved] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = (localStorage.getItem("ziki-theme") as Theme | null) ?? "system";
    const next = resolve(stored);
    document.documentElement.classList.toggle("dark", next === "dark");
    queueMicrotask(() => {
      setThemeState(stored);
      setResolved(next);
    });
  }, []);

  useEffect(() => {
    if (theme !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const next = resolve("system");
      setResolved(next);
      document.documentElement.classList.toggle("dark", next === "dark");
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [theme]);

  const setTheme = (next: Theme) => {
    setThemeState(next);
    localStorage.setItem("ziki-theme", next);
    const value = resolve(next);
    setResolved(value);
    document.documentElement.classList.toggle("dark", value === "dark");
  };

  const toggle = () => setTheme(resolved === "dark" ? "light" : "dark");

  return { theme, resolved, setTheme, toggle };
}

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { resolved, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${resolved === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${resolved === "dark" ? "light" : "dark"} mode`}
      className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-full text-zk-text2 transition-colors hover:bg-zk-chip hover:text-zk-text"
    >
      <Icon name={resolved === "dark" ? "sun" : "moon"} size={compact ? 17 : 18} />
    </button>
  );
}
