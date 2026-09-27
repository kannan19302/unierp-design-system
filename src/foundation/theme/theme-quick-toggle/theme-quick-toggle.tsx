"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Moon, Sun } from "lucide-react";
import { cva, type VariantProps } from "../../utils/cva";
import { useOptionalTheme } from "../theme-provider/theme-provider";
import styles from "./theme-quick-toggle.module.css";

export const themeQuickToggleVariants = cva(styles.toggleBtn, {
  variants: {
    density: {
      "ultra-compact": styles.densityUltraCompact,
      compact: styles.densityCompact,
      standard: styles.densityStandard,
      comfortable: styles.densityComfortable,
    },
  },
  defaultVariants: {
    density: "standard",
  },
});

export interface ThemeQuickToggleProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof themeQuickToggleVariants> {
  className?: string;
}

/** Header control intentionally limited to light/dark; advanced themes live in Account Center. */
export const ThemeQuickToggle = forwardRef<HTMLButtonElement, ThemeQuickToggleProps>(
  ({ density = "standard", className = "", ...props }, ref) => {
    const theme = useOptionalTheme();
    const resolvedTheme =
      theme?.resolvedTheme ??
      (typeof document !== "undefined"
        ? document.documentElement.dataset.theme ?? "light"
        : "light");
    const dark = resolvedTheme.toLowerCase().includes("dark");
    const next = dark ? "light" : "dark";

    const iconSize = density === "ultra-compact" ? 14 : density === "compact" ? 15 : density === "comfortable" ? 20 : 17;

    return (
      <button
        ref={ref}
        type="button"
        className={`${themeQuickToggleVariants({ density })} ${className}`.trim()}
        data-slot="theme-quick-toggle"
        data-density={density}
        onClick={(e) => {
          props.onClick?.(e);
          if (e.defaultPrevented) return;
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
        {...props}
      >
        {dark ? <Sun size={iconSize} aria-hidden="true" /> : <Moon size={iconSize} aria-hidden="true" />}
      </button>
    );
  }
);

ThemeQuickToggle.displayName = "ThemeQuickToggle";
