"use client";

import type { FC } from "react";
import { Moon, Sun } from "lucide-react";
import { useOptionalTheme } from "../theme-provider/theme-provider";


export interface ThemeQuickToggleProps {
  className?: string;
}

/** Header control intentionally limited to light/dark; advanced themes live in Account Center. */
export const ThemeQuickToggle: FC<ThemeQuickToggleProps> = ({ className }) => {
  const theme = useOptionalTheme();
  const resolvedTheme = theme?.resolvedTheme ??
    (typeof document !== "undefined" ? document.documentElement.dataset.theme ?? "light" : "light");
  const dark = resolvedTheme.toLowerCase().includes("dark");
  const next = dark ? "light" : "dark";
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        if (theme) {
          theme.setTheme(next);
          return;
        }
        document.documentElement.setAttribute("data-theme", next);
        window.localStorage.setItem("unierp.theme", next);
        document.cookie = `unierp_theme=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
      }}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 34,
        height: 34,
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-full, 999px)",
        background: "var(--color-bg-sunken)",
        color: "var(--color-text-secondary)",
        cursor: "pointer",
      }}
    >
      {dark ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
    </button>
  );
};
