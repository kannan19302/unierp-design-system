"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useId,
  useMemo,
  isValidElement,
  type FC,
  type ReactNode,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { Slot } from "@radix-ui/react-slot";
import { X } from "lucide-react";

// ── Focus trap utility ─────────────────────────────────
const FOCUSABLE_SELECTORS = [
  // `:not([tabindex="-1"])` on every native control, not just the generic
  // `[tabindex]` entry: an element is removed from the tab order by
  // `tabindex="-1"` REGARDLESS of its tag, and the previous list matched
  // `button:not([disabled])` first, so a deliberately-skipped button was still
  // treated as a tab stop.
  'a[href]:not([tabindex="-1"])',
  'button:not([disabled]):not([tabindex="-1"])',
  'input:not([disabled]):not([type="hidden"]):not([tabindex="-1"])',
  'select:not([disabled]):not([tabindex="-1"])',
  'textarea:not([disabled]):not([tabindex="-1"])',
  '[contenteditable]:not([contenteditable="false"]):not([tabindex="-1"])',
  '[tabindex]:not([tabindex="-1"])',
  'details > summary:not([tabindex="-1"])',
].join(", ");

/**
 * Focusable descendants of `container`, in DOM order.
 *
 * The visibility filter used to be `el.offsetParent !== null`. jsdom implements
 * no layout at all: `offsetParent` is ALWAYS null and `getClientRects()` is
 * ALWAYS empty, for every element. So that filter returned [] in every test for
 * every caller — which, combined with the portal timing bug fixed in
 * `useFocusTrap` below, is why the focus trap silently did nothing.
 *
 * Geometry is therefore consulted only when the environment can actually
 * compute it, detected by asking whether <body> itself has a box. That is a
 * capability check, not a `NODE_ENV` branch: the same code path runs in tests
 * and in the browser, and the browser still gets a real visibility test.
 */
function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const hasLayout =
    typeof document !== "undefined" &&
    typeof document.body?.getClientRects === "function" &&
    document.body.getClientRects().length > 0;

  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)).filter((el) => {
    if (el.hasAttribute("hidden")) return false;
    if (el.getAttribute("aria-hidden") === "true") return false;
    if (el.closest('[aria-hidden="true"], [inert]')) return false;
    if ((el as HTMLInputElement).disabled) return false;
    // jsdom DOES honour inline and stylesheet display/visibility here, so this
    // check is meaningful in both environments.
    const cs = typeof getComputedStyle === "function" ? getComputedStyle(el) : null;
    if (cs && (cs.display === "none" || cs.visibility === "hidden")) return false;
    // Only a real browser can answer "is this actually laid out".
    if (hasLayout && el.getClientRects().length === 0) return false;
    return true;
  });
}

/**
 * useFocusTrap — traps Tab/Shift+Tab inside the target while `active`.
 *
 * `target` may be a ref object (legacy call sites) or the element itself.
 * **Prefer passing the element**, held in state via a callback ref:
 *
 *     const [panel, setPanel] = useState<HTMLDivElement | null>(null);
 *     useFocusTrap(panel, open);
 *     return <Portal><div ref={setPanel} tabIndex={-1} …/></Portal>;
 *
 * Why that matters: the trapped element is normally rendered inside <Portal>,
 * which defers its children by one commit behind a `mounted` state guard (it
 * needs that to avoid an SSR/CSR hydration mismatch). Flipping that flag
 * re-renders PORTAL, not the component that owns the ref — so an effect in the
 * owner never re-runs, never sees `ref.current` fill in, and the trap silently
 * never arms. That is exactly what happened here: no element was focused and no
 * keydown listener was ever attached, for Drawer, Modal, DropdownMenu or
 * ContextMenu. A callback ref writing to state re-renders the OWNER at the
 * moment the node mounts, which is the one signal that actually arrives.
 *
 * A ref object is still accepted so external consumers keep compiling, but it
 * carries the caveat above and cannot be made reliable from inside this hook.
 */
export function useFocusTrap(
  target: React.RefObject<HTMLElement | null> | HTMLElement | null,
  active: boolean,
) {
  const container: HTMLElement | null =
    target && "current" in (target as React.RefObject<HTMLElement | null>)
      ? (target as React.RefObject<HTMLElement | null>).current
      : (target as HTMLElement | null);

  useEffect(() => {
    if (!active || !container) return;

    // Save previously focused element for restoration on close
    const previouslyFocused = document.activeElement as HTMLElement | null;

    // WAI-ARIA APG (Dialog Modal): focus the dialog CONTAINER when it can hold
    // focus, so its accessible name — the title — is announced before its
    // contents. Focusing the first focusable child instead announces only that
    // child and silently drops the dialog's name; it also makes initial focus
    // depend on DOM order, which for a Drawer means the header close button.
    if (container.hasAttribute("tabindex")) container.focus();
    else getFocusableElements(container)[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusable = getFocusableElements(container);
      if (!focusable.length) {
        e.preventDefault();
        return;
      }
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      const current = document.activeElement as HTMLElement | null;
      const pos = current ? focusable.indexOf(current) : -1;

      if (pos === -1) {
        // Focus is on the container itself (the APG initial focus above) or has
        // escaped the dialog entirely. Either way the next Tab has to land on a
        // defined edge rather than wherever the document's natural order points.
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
        return;
      }
      if (e.shiftKey && current === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && current === last) {
        e.preventDefault();
        first.focus();
      }
    };

    container.addEventListener("keydown", onKeyDown);
    return () => {
      container.removeEventListener("keydown", onKeyDown);
      // Restore focus only to a node still in the document — the trigger is
      // often unmounted alongside the overlay, and focusing a detached element
      // silently sends focus to <body>.
      if (previouslyFocused && document.contains(previouslyFocused)) {
        previouslyFocused.focus();
      }
    };
  }, [active, container]);
}

/** useScrollLock — locks body scroll while `active`. */
export function useScrollLock(active: boolean) {
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
export function useEscapeKey(onClose: () => void, active: boolean) {
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
export interface PortalProps {
  children: ReactNode;
}

export const Portal: FC<PortalProps> = ({ children }) => {
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

/**
 * Shared keyboard behaviour for `role="menu"` popups, used by both
 * `DropdownMenu` and `ContextMenu`.
 *
 * Roving tabIndex over REAL focus, rather than `aria-activedescendant`: moving
 * actual focus is what lets a native `<button role="menuitem">` handle its own
 * Enter/Space activation, so activation cannot drift out of sync with the
 * highlight. (The previous implementation stepped `activeIndex` over a
 * `filter(i => !i.disabled)` projection while `data-active` indexed the full
 * `items` array — so with any disabled item, Enter invoked a different entry
 * than the one highlighted.) Index here is always into `items`.
 *
 * Deliberately NOT a focus trap. A menu is not a modal dialog; the WAI-ARIA APG
 * menu-button pattern closes on Tab and returns focus to the trigger instead of
 * cycling within. Now that `useFocusTrap` actually works, trapping here would
 * be a new bug rather than a no-op.
 */
function useMenuKeyboard({
  items,
  open,
  onClose,
}: {
  items: MenuItem[];
  open: boolean;
  onClose: () => void;
}) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [menu, setMenu] = useState<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const enabledIdx = useMemo(
    () => items.map((it, i) => (it.disabled ? -1 : i)).filter((i) => i >= 0),
    [items],
  );

  const move = useCallback(
    (delta: 1 | -1) =>
      setActiveIndex((cur) => {
        if (!enabledIdx.length) return -1;
        const pos = enabledIdx.indexOf(cur);
        const next =
          pos === -1
            ? delta > 0
              ? 0
              : enabledIdx.length - 1
            : (pos + delta + enabledIdx.length) % enabledIdx.length;
        return enabledIdx[next]!;
      }),
    [enabledIdx],
  );

  useEffect(() => {
    if (!open) setActiveIndex(-1);
  }, [open]);

  // Focus follows the active index. While nothing is active — a menu opened by
  // mouse, per APG — the container itself holds focus so that arrow keys still
  // reach the handler below.
  useEffect(() => {
    if (!open) return;
    if (activeIndex >= 0) itemRefs.current[activeIndex]?.focus();
    else menu?.focus();
  }, [open, activeIndex, menu]);

  // Enter/Space are deliberately absent: focus is on a real <button>, so the
  // browser fires its click for us. Handling them here too would invoke the
  // item twice.
  const onKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      move(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      move(-1);
    } else if (e.key === "Home") {
      e.preventDefault();
      if (enabledIdx.length) setActiveIndex(enabledIdx[0]!);
    } else if (e.key === "End") {
      e.preventDefault();
      if (enabledIdx.length) setActiveIndex(enabledIdx[enabledIdx.length - 1]!);
    } else if (e.key === "Tab") {
      onClose();
    }
  };

  return { activeIndex, setActiveIndex, onKeyDown, itemRefs, menu, setMenu, enabledIdx };
}

export const DropdownMenu: FC<DropdownMenuProps> = ({ trigger, items, id }) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);
  // useId, not Math.random() during render: the old id changed on every render,
  // so `aria-controls` pointed at a stale value and the menu's `id` moved out
  // from under any assistive technology holding a reference to it.
  const generatedId = useId();
  const menuId = id ?? generatedId;

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus(); // APG: focus returns to the trigger
  }, []);

  const { activeIndex, setActiveIndex, onKeyDown, itemRefs, menu, setMenu, enabledIdx } =
    useMenuKeyboard({ items, open, onClose: close });

  useEscapeKey(close, open);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (
        menu && !menu.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) {
        close();
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open, close, menu]);

  const openWith = (idx: number) => {
    setOpen(true);
    setActiveIndex(idx);
  };

  const onTriggerKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      openWith(enabledIdx[0] ?? -1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      openWith(enabledIdx[enabledIdx.length - 1] ?? -1);
    }
  };

  // Merge onto the caller's element instead of wrapping it. Wrapping produced
  // `<button aria-haspopup="menu"><button>Menu</button></button>` for every call
  // site in this repo — an axe `nested-interactive` violation and a React
  // "cannot appear as a descendant" warning. A non-element trigger (a bare
  // string) still gets a real button, so the prop contract is unchanged.
  const TriggerTag = isValidElement(trigger) ? Slot : "button";

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <TriggerTag
        ref={triggerRef as never}
        {...(TriggerTag === "button" ? { type: "button" as const } : {})}
        onClick={() => (open ? close() : openWith(-1))}
        onKeyDown={onTriggerKeyDown}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
      >
        {trigger}
      </TriggerTag>
      {open && (
        <Portal>
          <div
            ref={setMenu}
            id={menuId}
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
                type="button"
                role="menuitem"
                ref={(el) => {
                  itemRefs.current[idx] = el;
                }}
                disabled={item.disabled}
                aria-disabled={item.disabled}
                // Roving tabIndex: exactly one item is in the tab order at a
                // time, so Tab leaves the menu (which onKeyDown turns into a
                // close) rather than walking through every entry.
                tabIndex={activeIndex === idx ? 0 : -1}
                onClick={() => {
                  if (item.disabled) return;
                  item.onClick?.();
                  close();
                }}
                // Hover drives the SAME state as the arrow keys instead of
                // mutating inline styles directly, so the pointer and the
                // keyboard cannot end up highlighting two different rows.
                onMouseEnter={() => {
                  if (!item.disabled) setActiveIndex(idx);
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
  const open = pos !== null;

  const close = useCallback(() => setPos(null), []);
  useEscapeKey(close, open);

  // Shares DropdownMenu's keyboard model. Previously this component had NO
  // keyboard handling at all — the menu could be opened but never driven — and
  // it called useFocusTrap, which was inert only because the trap was broken.
  // Fixing the trap would have silently armed it here, which is wrong for a
  // menu, so the trap is gone and real arrow-key navigation takes its place.
  const { activeIndex, setActiveIndex, onKeyDown, itemRefs, menu, setMenu } =
    useMenuKeyboard({ items, open, onClose: close });

  const onContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setPos({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (menu && !menu.contains(e.target as Node)) close();
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [open, close, menu]);

  return (
    <div onContextMenu={onContextMenu} style={{ display: "inline-block" }}>
      {children}
      {pos && (
        <Portal>
          <div
            ref={setMenu}
            role="menu"
            onKeyDown={onKeyDown}
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
            {items.map((item, idx) => (
              <button
                key={item.key}
                type="button"
                role="menuitem"
                ref={(el) => {
                  itemRefs.current[idx] = el;
                }}
                disabled={item.disabled}
                aria-disabled={item.disabled}
                tabIndex={activeIndex === idx ? 0 : -1}
                onClick={() => {
                  if (item.disabled) return;
                  item.onClick?.();
                  close();
                }}
                onMouseEnter={() => {
                  if (!item.disabled) setActiveIndex(idx);
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
  size?: "sm" | "md" | "lg";
  width?: number;
  footer?: ReactNode;
  children?: ReactNode;
  "aria-label"?: string;
}

const DRAWER_WIDTH: Record<NonNullable<DrawerProps["size"]>, number> = {
  sm: 360,
  md: 480,
  lg: 640,
};

export const Drawer: FC<DrawerProps> = ({
  open,
  onClose,
  title,
  side = "right",
  size = "md",
  width,
  footer,
  children,
  "aria-label": ariaLabel,
}) => {
  // Callback ref into state, not useRef: the panel is rendered inside <Portal>,
  // which mounts its children in a later commit of its own. A ref object would
  // still be null when this component's effects run and would never notify us
  // when it filled in — see useFocusTrap's note. Setting state re-renders THIS
  // component at the moment the node exists, which is what arms the trap.
  const [panel, setPanel] = useState<HTMLDivElement | null>(null);
  useEscapeKey(onClose, open);
  useFocusTrap(panel, open);
  useScrollLock(open);

  if (!open) return null;

  const contentWidth = width ?? DRAWER_WIDTH[size];
  const sideStyles: Record<string, CSSProperties> = {
    right: { top: 0, right: 0, bottom: 0, width: contentWidth },
    left: { top: 0, left: 0, bottom: 0, width: contentWidth },
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
        ref={setPanel}
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
        {footer && <div style={{ marginTop: "var(--space-4)" }}>{footer}</div>}
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
