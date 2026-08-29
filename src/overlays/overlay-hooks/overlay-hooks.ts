"use client";

import { useEffect, useCallback, useState, useMemo, useRef, type RefObject, type KeyboardEvent as ReactKeyboardEvent } from "react";

const FOCUSABLE_SELECTORS = [
  'a[href]:not([tabindex="-1"])',
  'button:not([disabled]):not([tabindex="-1"])',
  'input:not([disabled]):not([type="hidden"]):not([tabindex="-1"])',
  'select:not([disabled]):not([tabindex="-1"])',
  'textarea:not([disabled]):not([tabindex="-1"])',
  '[contenteditable]:not([contenteditable="false"]):not([tabindex="-1"])',
  '[tabindex]:not([tabindex="-1"])',
  'details > summary:not([tabindex="-1"])',
].join(", ");

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
    const cs = typeof getComputedStyle === "function" ? getComputedStyle(el) : null;
    if (cs && (cs.display === "none" || cs.visibility === "hidden")) return false;
    if (hasLayout && el.getClientRects().length === 0) return false;
    return true;
  });
}

export function useFocusTrap(
  target: RefObject<HTMLElement | null> | HTMLElement | null,
  active: boolean
) {
  const container: HTMLElement | null =
    target && "current" in (target as RefObject<HTMLElement | null>)
      ? (target as RefObject<HTMLElement | null>).current
      : (target as HTMLElement | null);

  useEffect(() => {
    if (!active || !container) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

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
      if (previouslyFocused && document.contains(previouslyFocused)) {
        previouslyFocused.focus();
      }
    };
  }, [active, container]);
}

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

export function useEscapeKey(onClose: () => void, active: boolean) {
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [active, onClose]);
}

export interface MenuItem {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  danger?: boolean;
  onClick?: () => void;
}

export function useMenuKeyboard({
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
    [items]
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
    [enabledIdx]
  );

  useEffect(() => {
    if (!open) setActiveIndex(-1);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (activeIndex >= 0) itemRefs.current[activeIndex]?.focus();
    else menu?.focus();
  }, [open, activeIndex, menu]);

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
