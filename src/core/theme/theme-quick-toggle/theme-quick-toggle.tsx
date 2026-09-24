"use client";

import { forwardRef } from "react";
import { Moon, Sun } from "lucide-react";
import { useOptionalTheme } from "../theme-provider/theme-provider";
import styles from "./theme-quick-toggle.module.css";

export interface ThemeQuickToggleProps {
  className?: string;
}

/** Header control intentionally limited to light/dark; advanced themes live in Account Center. */
export const ThemeQuickToggle = forwardRef<HTMLButtonElement, ThemeQuickToggleProps>(
  ({ className = "" }, ref) => {
    const theme = useOptionalTheme();
    const resolvedTheme =
      theme?.resolvedTheme ??
      (typeof document !== "undefined"
        ? document.documentElement.dataset.theme ?? "light"
        : "light");
    const dark = resolvedTheme.toLowerCase().includes("dark");
    const next = dark ? "light" : "dark";

    const btnClasses = [styles.toggleBtn, className].filter(Boolean).join(" ");

    return (
      <button
        ref={ref}
        type="button"
        className={btnClasses}
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
      >
        {dark ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
      </button>
    );
  }
);

ThemeQuickToggle.displayName = "ThemeQuickToggle";
