"use client";

import {
  useState,
  useEffect,
  type FC,
  type ReactNode,
} from "react";
import { ChevronRight, Search, Command, X } from "lucide-react";

// ── useCommandPalette — global Ctrl+K / Cmd+K shortcut ─
// B04: "the command palette is reachable via one shortcut from every page"
//
// Usage: const { open, setOpen } = useCommandPalette();
// Wrap your app with a <CommandPalette open={open} onClose={() => setOpen(false)} items={...} />
// and this hook will wire the keyboard shortcut automatically.
export function useCommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Ctrl+K (Windows/Linux) or Cmd+K (macOS)
      if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setOpen((prev: any) => !prev);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return { open, setOpen };
}

// ── Breadcrumb ────────────────────────────────────────
export interface BreadcrumbItem {
  key?: string;
  label: ReactNode;
  href?: string;
  onClick?: () => void;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: ReactNode;
}

export const Breadcrumb: FC<BreadcrumbProps> = ({
  items,
  separator = <ChevronRight size={14} style={{ color: "var(--color-text-muted)" }} />,
}: any) => {
  return (
    <nav aria-label="Breadcrumb">
      <ol
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-2)",
          listStyle: "none",
          margin: 0,
          padding: 0,
          fontSize: "var(--text-sm)",
        }}
      >
        {items.map((item: any, index: any) => {
          const isLast = index === items.length - 1;
          return (
            <li
              key={item.key || index}
              style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}
            >
              {item.href ? (
                <a
                  href={item.href}
                  onClick={(e: any) => {
                    if (item.onClick) {
                      e.preventDefault();
                      item.onClick();
                    }
                  }}
                  style={{
                    color: isLast ? "var(--color-text)" : "var(--color-text-secondary)",
                    textDecoration: "none",
                    fontWeight: isLast ? 600 : 400,
                  }}
                >
                  {item.label}
                </a>
              ) : (
                <span
                  onClick={item.onClick}
                  style={{
                    color: isLast ? "var(--color-text)" : "var(--color-text-secondary)",
                    cursor: item.onClick ? "pointer" : "default",
                    fontWeight: isLast ? 600 : 400,
                  }}
                >
                  {item.label}
                </span>
              )}
              {!isLast && <span aria-hidden="true">{separator}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

// ── SideNav ───────────────────────────────────────────
export interface SideNavItem {
  key: string;
  label: ReactNode;
  icon?: ReactNode;
  badge?: ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export interface SideNavProps {
  items: SideNavItem[];
  header?: ReactNode;
  footer?: ReactNode;
}

export const SideNav: FC<SideNavProps> = ({ items, header, footer }: any) => {
  return (
    <aside
      aria-label="Side Navigation"
      style={{
        width: "240px",
        background: "var(--color-bg-sunken)",
        borderRight: "1px solid var(--color-border)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: "var(--space-3)",
      }}
    >
      {header && <div style={{ marginBottom: "var(--space-4)" }}>{header}</div>}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
        {items.map((item: any) => (
          <button
            key={item.key}
            disabled={item.disabled}
            onClick={item.onClick}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "var(--space-3)",
              padding: "var(--space-2) var(--space-3)",
              borderRadius: "var(--radius-md)",
              border: "none",
              background: item.active ? "var(--color-primary-light, rgba(59, 130, 246, 0.1))" : "transparent",
              color: item.active
                ? "var(--color-primary)"
                : item.disabled
                  ? "var(--color-text-muted)"
                  : "var(--color-text)",
              fontWeight: item.active ? 600 : 400,
              fontSize: "var(--text-sm)",
              cursor: item.disabled ? "not-allowed" : "pointer",
              textAlign: "left",
            }}
          >
            {item.icon}
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.badge}
          </button>
        ))}
      </nav>
      {footer && <div style={{ marginTop: "var(--space-4)" }}>{footer}</div>}
    </aside>
  );
};

// ── CommandPalette ────────────────────────────────────
export interface CommandItem {
  id: string;
  category: string;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  onSelect: () => void;
}

export interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  items: CommandItem[];
  placeholder?: string;
}

export const CommandPalette: FC<CommandPaletteProps> = ({
  open,
  onClose,
  items,
  placeholder = "Search routes, records and actions...",
}: any) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filtered = items.filter(
    (item: any) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase()) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(query.toLowerCase()))
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev: any) => (prev + 1) % (filtered.length || 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev: any) => (prev - 1 + (filtered.length || 1)) % (filtered.length || 1));
      } else if (e.key === "Enter" && filtered[selectedIndex]) {
        e.preventDefault();
        filtered[selectedIndex].onSelect();
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose, filtered, selectedIndex]);

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "12vh",
      }}
      onClick={(e: any) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        style={{
          width: "100%",
          maxWidth: "600px",
          background: "var(--color-bg-elevated)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-2xl)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-3)",
            padding: "var(--space-3) var(--space-4)",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <Search size={18} style={{ color: "var(--color-text-muted)" }} />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e: any) => setQuery(e.target.value)}
            placeholder={placeholder}
            style={{
              flex: 1,
              background: "none",
              border: "none",
              outline: "none",
              fontSize: "var(--text-base)",
              color: "var(--color-text)",
            }}
          />
          <button
            onClick={onClose}
            aria-label="Close"
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)" }}
          >
            <X size={18} />
          </button>
        </div>
        <div style={{ maxHeight: "360px", overflowY: "auto", padding: "var(--space-2)" }}>
          {filtered.length === 0 ? (
            <div style={{ padding: "var(--space-6)", textAlign: "center", color: "var(--color-text-muted)" }}>
              No results found.
            </div>
          ) : (
            filtered.map((item: any, idx: any) => {
              const active = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    item.onSelect();
                    onClose();
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-3)",
                    padding: "var(--space-2-5) var(--space-3)",
                    borderRadius: "var(--radius-md)",
                    background: active ? "var(--color-bg-hover)" : "transparent",
                    cursor: "pointer",
                  }}
                >
                  {item.icon || <Command size={16} style={{ color: "var(--color-text-muted)" }} />}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--color-text)" }}>
                      {item.title}
                    </div>
                    {item.subtitle && (
                      <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
                        {item.subtitle}
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", textTransform: "uppercase" }}>
                    {item.category}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

// ── Steps ─────────────────────────────────────────────
export interface StepItem {
  title: string;
  description?: string;
}

export interface StepsProps {
  steps: StepItem[];
  current: number; // 0-indexed
}

export const Steps: FC<StepsProps> = ({ steps, current }: any) => {
  return (
    <div style={{ display: "flex", alignItems: "center", width: "100%", gap: "var(--space-2)" }}>
      {steps.map((step: any, idx: any) => {
        const active = idx === current;
        const completed = idx < current;
        return (
          <div key={idx} style={{ display: "flex", alignItems: "center", flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "var(--text-xs)",
                  fontWeight: 600,
                  background: completed
                    ? "var(--color-success)"
                    : active
                      ? "var(--color-primary)"
                      : "var(--color-bg-sunken)",
                  color: completed || active ? "#ffffff" : "var(--color-text-muted)",
                }}
              >
                {completed ? "✓" : idx + 1}
              </div>
              <div>
                <div style={{ fontSize: "var(--text-xs)", fontWeight: active ? 600 : 400 }}>{step.title}</div>
                {step.description && <div style={{ fontSize: "10px", color: "var(--color-text-muted)" }}>{step.description}</div>}
              </div>
            </div>
            {idx < steps.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: "2px",
                  margin: "0 var(--space-2)",
                  background: idx < current ? "var(--color-success)" : "var(--color-border)",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
