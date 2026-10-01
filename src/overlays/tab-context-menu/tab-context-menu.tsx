"use client";

import { useEffect, useId, useMemo, useRef, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent } from "react";
import styles from "./tab-context-menu.module.css";

export type ContextMenuTarget =
  | {
      type: "tab";
      tabId: string;
      tabTitle: string;
      tabHref: string;
      pinned: boolean;
      closable: boolean;
      index: number;
      totalTabs: number;
    }
  | { type: "tabstrip"; canReopen?: boolean; reopenTitle?: string }
  | { type: "nav"; href: string; label: string };

export interface TabContextMenuPosition {
  x: number;
  y: number;
}

export interface TabContextMenuProps {
  target: ContextMenuTarget | null;
  position: TabContextMenuPosition | null;
  onClose: () => void;
  onCloseTab?: (tabId: string) => void;
  onCloseOtherTabs?: (tabId: string) => void;
  onCloseTabsToRight?: (tabId: string) => void;
  onCloseTabsToLeft?: (tabId: string) => void;
  onCloseAllTabs?: () => void;
  onDuplicateTab?: (tabId: string) => void;
  onTogglePinTab?: (tabId: string) => void;
  onMoveTab?: (tabId: string, direction: "left" | "right") => void;
  onReloadTab?: (tabId: string) => void;
  onReopenClosedTab?: () => void;
  onNewTab?: () => void;
  onCopyTabLink?: (href: string) => void;
  onOpenInNewWindow?: (href: string) => void;
  onBookmarkTab?: (href: string) => void;
  onOpenNavigation?: (href: string) => void;
}

interface MenuAction {
  key: string;
  label: string;
  onSelect?: () => void;
  disabled?: boolean;
}

/** A callback-only tab menu. Tab state and every action effect remain consumer-owned. */
export function TabContextMenu({
  target,
  position,
  onClose,
  onCloseTab,
  onCloseOtherTabs,
  onCloseTabsToRight,
  onCloseTabsToLeft,
  onCloseAllTabs,
  onDuplicateTab,
  onTogglePinTab,
  onMoveTab,
  onReloadTab,
  onReopenClosedTab,
  onNewTab,
  onCopyTabLink,
  onOpenInNewWindow,
  onBookmarkTab,
  onOpenNavigation,
}: TabContextMenuProps) {
  const menuId = useId();
  const menuRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const actions = useMemo<MenuAction[]>(() => {
    if (!target) return [];
    const add = (
      key: string,
      label: string,
      callback: (() => void) | undefined,
      disabled = false,
    ): MenuAction => ({
      key,
      label,
      onSelect: callback,
      disabled: disabled || !callback,
    });

    if (target.type === "tab") {
      const id = target.tabId;
      const href = target.tabHref;
      return [
        add("reload", "Reload tab", onReloadTab ? () => onReloadTab(id) : undefined),
        add("duplicate", "Duplicate tab", onDuplicateTab ? () => onDuplicateTab(id) : undefined),
        add("pin", target.pinned ? "Unpin tab" : "Pin tab", onTogglePinTab ? () => onTogglePinTab(id) : undefined),
        add("move-left", "Move tab left", onMoveTab ? () => onMoveTab(id, "left") : undefined, target.index <= 0),
        add("move-right", "Move tab right", onMoveTab ? () => onMoveTab(id, "right") : undefined, target.index >= target.totalTabs - 1),
        add("close", "Close tab  Ctrl+W", onCloseTab ? () => onCloseTab(id) : undefined, target.pinned || !target.closable),
        add("close-others", "Close other tabs", onCloseOtherTabs ? () => onCloseOtherTabs(id) : undefined),
        add("close-right", "Close tabs to the right", onCloseTabsToRight ? () => onCloseTabsToRight(id) : undefined, target.index >= target.totalTabs - 1),
        add("close-left", "Close tabs to the left", onCloseTabsToLeft ? () => onCloseTabsToLeft(id) : undefined, target.index <= 0),
        add("close-all", "Close all tabs", onCloseAllTabs),
        add("reopen", "Reopen closed tab", onReopenClosedTab),
        add("copy-link", "Copy tab link", onCopyTabLink ? () => onCopyTabLink(href) : undefined),
        add("new-window", "Open in new window", onOpenInNewWindow ? () => onOpenInNewWindow(href) : undefined),
        add("bookmark", "Bookmark tab", onBookmarkTab ? () => onBookmarkTab(href) : undefined),
      ];
    }

    if (target.type === "tabstrip") {
      return [
        add("new-tab", "New tab", onNewTab),
        ...(target.canReopen
          ? [add("reopen", `Reopen: ${target.reopenTitle ?? "closed tab"}`, onReopenClosedTab)]
          : []),
        add("close-all", "Close all tabs", onCloseAllTabs),
      ];
    }

    return [
      add("open-navigation", `Open ${target.label}`, onOpenNavigation ? () => onOpenNavigation(target.href) : undefined),
      add("copy-link", "Copy link", onCopyTabLink ? () => onCopyTabLink(target.href) : undefined),
      add("new-window", "Open in new window", onOpenInNewWindow ? () => onOpenInNewWindow(target.href) : undefined),
      add("bookmark", "Bookmark", onBookmarkTab ? () => onBookmarkTab(target.href) : undefined),
    ];
  }, [
    target,
    onReloadTab,
    onDuplicateTab,
    onTogglePinTab,
    onMoveTab,
    onCloseTab,
    onCloseOtherTabs,
    onCloseTabsToRight,
    onCloseTabsToLeft,
    onCloseAllTabs,
    onReopenClosedTab,
    onNewTab,
    onCopyTabLink,
    onOpenInNewWindow,
    onBookmarkTab,
    onOpenNavigation,
  ]);

  useEffect(() => {
    if (!target || !position) return;
    const first = itemRefs.current.find((item) => item && !item.disabled);
    first?.focus();

    const dismissEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      onClose();
    };
    const dismissOutside = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) onClose();
    };
    document.addEventListener("keydown", dismissEscape);
    document.addEventListener("pointerdown", dismissOutside);
    return () => {
      document.removeEventListener("keydown", dismissEscape);
      document.removeEventListener("pointerdown", dismissOutside);
    };
  }, [target, position, onClose]);

  if (!target || !position) return null;

  const direction = typeof document !== "undefined" ? document.documentElement.dir : "ltr";
  const inlineStart = direction === "rtl" && typeof window !== "undefined"
    ? Math.max(0, window.innerWidth - position.x)
    : Math.max(0, position.x);
  const style: CSSProperties = {
    insetBlockStart: `${Math.max(0, position.y)}px`,
    insetInlineStart: `${inlineStart}px`,
  };
  const label = target.type === "tab"
    ? `Tab options for ${target.tabTitle}`
    : target.type === "tabstrip"
      ? "Tab strip options"
      : `Navigation options for ${target.label}`;

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const enabled = itemRefs.current.filter((item): item is HTMLButtonElement => Boolean(item && !item.disabled));
    const activeIndex = enabled.indexOf(document.activeElement as HTMLButtonElement);
    let nextIndex: number | undefined;
    if (event.key === "ArrowDown") nextIndex = (activeIndex + 1) % enabled.length;
    if (event.key === "ArrowUp") nextIndex = (activeIndex - 1 + enabled.length) % enabled.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = enabled.length - 1;
    if (nextIndex !== undefined && enabled.length > 0) {
      event.preventDefault();
      enabled[nextIndex]?.focus();
    }
  };

  return (
    <div
      ref={menuRef}
      id={menuId}
      className={styles.menu}
      role="menu"
      aria-label={label}
      data-slot="tab-context-menu"
      onKeyDown={handleKeyDown}
      style={style}
    >
      {actions.map((action, index) => (
        <button
          key={action.key}
          ref={(node) => { itemRefs.current[index] = node; }}
          className={styles.item}
          type="button"
          role="menuitem"
          tabIndex={-1}
          disabled={action.disabled}
          aria-disabled={action.disabled || undefined}
          onClick={() => {
            if (action.disabled) return;
            action.onSelect?.();
            onClose();
          }}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
