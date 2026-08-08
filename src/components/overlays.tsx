"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type FC,
  type ReactNode,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

// ── Focus trap utility ─────────────────────────────────
const FOCUSABLE_SELECTORS = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
  "details > summary",
].join(", ");

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)).filter(
    (el) => el.offsetParent !== null, // visible only
  );
}

/** useFocusTrap — traps Tab/Shift+Tab inside `containerRef` while `active`. */
function useFocusTrap(containerRef: React.RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    if (!active || !containerRef.current) return;
    const container = containerRef.current;

    // Save previously focused element for restoration on close
    const previouslyFocused = document.activeElement as HTMLElement | null;

    // Move focus into the container
    const focusables = getFocusableElements(container);
    if (focusables.length && focusables[0]) focusables[0].focus();
    else container.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusable = getFocusableElements(container);
      if (!focusable.length) {
        e.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first && last) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last && first) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    container.addEventListener("keydown", onKeyDown);
    return () => {
      container.removeEventListener("keydown", onKeyDown);
      // Restore focus on unmount
      previouslyFocused?.focus();
    };
  }, [active, containerRef]);
}

/** useScrollLock — locks body scroll while `active`. */
function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [active]);
}

/** useEscapeKey — calls `onClose` when Escape is pressed. */
function useEscapeKey(onClose: () => void, active: boolean) {
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener("keydown", onKey, true); // capture so innermost fires first
    return () => document.removeEventListener("keydown", onKey, true);
  }, [active, onClose]);
}

// ── Portal wrapper ─────────────────────────────────────
interface PortalProps {
  children: ReactNode;
}

const Portal: FC<PortalProps> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(children, document.body);
};

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
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    if (onOpenChange) onOpenChange(false);
    else setInternalOpen(false);
  }, [onOpenChange]);

  const toggle = () => {
    const next = !open;
    if (onOpenChange) onOpenChange(next);
    else setInternalOpen(next);
  };

  useEscapeKey(close, open);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        close();
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open, close]);

  const alignStyle: CSSProperties =
    align === "right"
      ? { right: 0 }
      : align === "center"
        ? { left: "50%", transform: "translateX(-50%)" }
        : { left: 0 };

  return (
    <div ref={triggerRef} style={{ position: "relative", display: "inline-block" }}>
      <div
        onClick={toggle}
        style={{ display: "inline-block" }}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        {trigger}
      </div>
      {open && (
        <Portal>
          <div
            ref={contentRef}
            role="dialog"
            aria-modal="false"
            style={{
              position: "fixed",
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
        </Portal>
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
  id?: string;
}

export const DropdownMenu: FC<DropdownMenuProps> = ({ trigger, items, id }) => {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const listboxId = id ?? `menu-${Math.random().toString(36).slice(2)}`;

  const close = useCallback(() => {
    setOpen(false);
    setActiveIndex(-1);
  }, []);

  useEscapeKey(close, open);
  useFocusTrap(menuRef, open);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node) &&
          triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open, close]);

  const onKeyDown = (e: ReactKeyboardEvent) => {
    const enabledItems = items.filter((i) => !i.disabled);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, enabledItems.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActiveIndex(enabledItems.length - 1);
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      enabledItems[activeIndex]?.onClick?.();
      close();
    }
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        ref={triggerRef}
        onClick={() => setOpen(!open)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
      >
        {trigger}
      </button>
      {open && (
        <Portal>
          <div
            ref={menuRef}
            id={listboxId}
            role="menu"
            onKeyDown={onKeyDown}
            tabIndex={-1}
            style={{
              position: "fixed",
              zIndex: 1000,
              background: "var(--color-bg-elevated)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
              boxShadow: "var(--shadow-lg)",
              padding: "var(--space-1) 0",
              minWidth: "160px",
            }}
          >
            {items.map((item, idx) => (
              <button
                key={item.key}
                role="menuitem"
                disabled={item.disabled}
                aria-disabled={item.disabled}
                onClick={() => {
                  if (item.disabled) return;
                  item.onClick?.();
                  close();
                }}
                data-active={activeIndex === idx}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "var(--space-2) var(--space-3)",
                  background: activeIndex === idx ? "var(--color-bg-hover)" : "none",
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
                  if (activeIndex !== idx) {
                    e.currentTarget.style.background = "none";
                  }
                }}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </Portal>
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
  const menuRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setPos(null), []);
  useEscapeKey(close, pos !== null);
  useFocusTrap(menuRef, pos !== null);

  const onContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setPos({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    if (!pos) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) close();
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [pos, close]);

  return (
    <div onContextMenu={onContextMenu} style={{ display: "inline-block" }}>
      {children}
      {pos && (
        <Portal>
          <div
            ref={menuRef}
            role="menu"
            tabIndex={-1}
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
                aria-disabled={item.disabled}
                onClick={() => {
                  if (item.disabled) return;
                  item.onClick?.();
                  close();
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
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </Portal>
      )}
    </div>
  );
};

// ── Tooltip ───────────────────────────────────────────
export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  id?: string;
}

export const Tooltip: FC<TooltipProps> = ({ content, children, side: _side = "top", id }) => {
  const [visible, setVisible] = useState(false);
  const tooltipId = id ?? `tooltip-${Math.random().toString(36).slice(2)}`;

  return (
    <span
      style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      <span aria-describedby={tooltipId}>{children}</span>
      {visible && (
        <Portal>
          <div
            id={tooltipId}
            role="tooltip"
            style={{
              position: "fixed",
              zIndex: 9999,
              background: "var(--color-text)",
              color: "var(--color-bg)",
              padding: "var(--space-1) var(--space-2)",
              borderRadius: "var(--radius-sm)",
              fontSize: "var(--text-xs)",
              pointerEvents: "none",
              whiteSpace: "nowrap",
            }}
          >
            {content}
          </div>
        </Portal>
      )}
    </span>
  );
};

// ── Drawer ────────────────────────────────────────────
export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  side?: "left" | "right" | "top" | "bottom";
  children?: ReactNode;
  "aria-label"?: string;
}

export const Drawer: FC<DrawerProps> = ({
  open,
  onClose,
  title,
  side = "right",
  children,
  "aria-label": ariaLabel,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  useEscapeKey(onClose, open);
  useFocusTrap(contentRef, open);
  useScrollLock(open);

  if (!open) return null;

  const sideStyles: Record<string, CSSProperties> = {
    right: { top: 0, right: 0, bottom: 0, width: "380px" },
    left: { top: 0, left: 0, bottom: 0, width: "380px" },
    top: { top: 0, left: 0, right: 0, height: "300px" },
    bottom: { bottom: 0, left: 0, right: 0, height: "300px" },
  };

  return (
    <Portal>
      {/* Backdrop */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background: "rgba(0, 0, 0, 0.4)",
        }}
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Panel */}
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel ?? (typeof title === "string" ? title : undefined)}
        tabIndex={-1}
        style={{
          position: "fixed",
          zIndex: 10000,
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
            aria-label="Close drawer"
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
    </Portal>
  );
};

// ── Sheet (alias for Drawer with different defaults) ──
export interface SheetProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  side?: "left" | "right" | "top" | "bottom";
  children?: ReactNode;
}

export const Sheet: FC<SheetProps> = ({ open, onClose, title, side = "right", children }) => (
  <Drawer open={open} onClose={onClose} title={title} side={side}>
    {children}
  </Drawer>
);
