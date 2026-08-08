"use client";

import {
  useState,
  useEffect,
  useRef,
  type FC,
  type ReactNode,
  type CSSProperties,
} from "react";
import { X } from "lucide-react";

// ── Popover ───────────────────────────────────────────
export interface PopoverProps {
  trigger: ReactNode;
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  align?: "left" | "right" | "center";
}

export const Popover: FC<PopoverProps> = ({
  trigger,
  children,
  open: controlledOpen,
  onOpenChange,
  align = "left",
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const ref = useRef<HTMLDivElement>(null);

  const toggle = () => {
    const next = !open;
    if (onOpenChange) onOpenChange(next);
    else setInternalOpen(next);
  };

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        if (onOpenChange) onOpenChange(false);
        else setInternalOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (onOpenChange) onOpenChange(false);
        else setInternalOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onOpenChange]);

  const alignStyle: CSSProperties =
    align === "right"
      ? { right: 0 }
      : align === "center"
        ? { left: "50%", transform: "translateX(-50%)" }
        : { left: 0 };

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <div onClick={toggle} style={{ display: "inline-block" }}>
        {trigger}
      </div>
      {open && (
        <div
          role="dialog"
          style={{
            position: "absolute",
            top: "100%",
            marginTop: "var(--space-2)",
            zIndex: 1000,
            background: "var(--color-bg-elevated)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-lg)",
            padding: "var(--space-3)",
            minWidth: "200px",
            ...alignStyle,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

// ── Menu & DropdownMenu ───────────────────────────────
export interface MenuItem {
  key: string;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  danger?: boolean;
  onClick?: () => void;
}

export interface DropdownMenuProps {
  trigger: ReactNode;
  items: MenuItem[];
}

export const DropdownMenu: FC<DropdownMenuProps> = ({ trigger, items }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <div onClick={() => setOpen(!open)} style={{ display: "inline-block" }}>
        {trigger}
      </div>
      {open && (
        <div
          role="menu"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            marginTop: "var(--space-1)",
            zIndex: 1000,
            background: "var(--color-bg-elevated)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-lg)",
            padding: "var(--space-1) 0",
            minWidth: "160px",
          }}
        >
          {items.map((item) => (
            <button
              key={item.key}
              role="menuitem"
              disabled={item.disabled}
              onClick={() => {
                if (item.disabled) return;
                item.onClick?.();
                setOpen(false);
              }}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "var(--space-2) var(--space-3)",
                background: "none",
                border: "none",
                fontSize: "var(--text-sm)",
                color: item.danger
                  ? "var(--color-danger)"
                  : item.disabled
                    ? "var(--color-text-muted)"
                    : "var(--color-text)",
                cursor: item.disabled ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
              }}
              onMouseEnter={(e) => {
                if (!item.disabled) {
                  e.currentTarget.style.background = "var(--color-bg-hover)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "none";
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ── ContextMenu ───────────────────────────────────────
export interface ContextMenuProps {
  children: ReactNode;
  items: MenuItem[];
}

export const ContextMenu: FC<ContextMenuProps> = ({ children, items }) => {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const onContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setPos({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    if (!pos) return;
    const onClick = () => setPos(null);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPos(null);
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [pos]);

  return (
    <div onContextMenu={onContextMenu} style={{ display: "inline-block" }}>
      {children}
      {pos && (
        <div
          ref={ref}
          role="menu"
          style={{
            position: "fixed",
            top: pos.y,
            left: pos.x,
            zIndex: 10000,
            background: "var(--color-bg-elevated)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-lg)",
            padding: "var(--space-1) 0",
            minWidth: "160px",
          }}
        >
          {items.map((item) => (
            <button
              key={item.key}
              role="menuitem"
              disabled={item.disabled}
              onClick={() => {
                if (item.disabled) return;
                item.onClick?.();
                setPos(null);
              }}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "var(--space-2) var(--space-3)",
                background: "none",
                border: "none",
                fontSize: "var(--text-sm)",
                color: item.danger
                  ? "var(--color-danger)"
                  : item.disabled
                    ? "var(--color-text-muted)"
                    : "var(--color-text)",
                cursor: item.disabled ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
              }}
              onMouseEnter={(e) => {
                if (!item.disabled) {
                  e.currentTarget.style.background = "var(--color-bg-hover)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "none";
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Sheet ─────────────────────────────────────────────
export interface SheetProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  side?: "left" | "right" | "top" | "bottom";
  children?: ReactNode;
}

export const Sheet: FC<SheetProps> = ({
  open,
  onClose,
  title,
  side = "right",
  children,
}) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const sideStyles: Record<string, CSSProperties> = {
    right: { top: 0, right: 0, bottom: 0, width: "380px" },
    left: { top: 0, left: 0, bottom: 0, width: "380px" },
    top: { top: 0, left: 0, right: 0, height: "300px" },
    bottom: { bottom: 0, left: 0, right: 0, height: "300px" },
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0, 0, 0, 0.4)",
        display: "flex",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: "absolute",
          background: "var(--color-bg-elevated)",
          border: "1px solid var(--color-border)",
          boxShadow: "var(--shadow-xl)",
          display: "flex",
          flexDirection: "column",
          padding: "var(--space-4)",
          ...sideStyles[side],
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "var(--space-3)",
          }}
        >
          <h2 style={{ fontSize: "var(--text-base)", fontWeight: 600 }}>{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close sheet"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "var(--space-1)",
            }}
          >
            <X size={18} />
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>{children}</div>
      </div>
    </div>
  );
};
