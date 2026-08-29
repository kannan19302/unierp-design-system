"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type FC,
  type KeyboardEvent,
} from "react";
import styles from "./studio-palette.module.css";

/**
 * `<StudioPalette>` — the insert source for every builder.
 *
 * The rule this component exists to enforce: **drag is an accelerator, never
 * the only path.** Four of the platform's builders shipped drag-only insertion
 * (`@dnd-kit` in the form builder, `@xyflow/react` in the flow editor,
 * `react-grid-layout` in the dashboard editor), which makes them unusable
 * without a pointer and fails WCAG 2.2 AA — the standard UI_UX_BRIEF §8 calls
 * non-negotiable. Here, every item is a real `<button>`: reachable by keyboard,
 * announced by a screen reader, and activated with Enter or Space.
 *
 * Groups are the caller's job, but Miller's Law (UI_UX_BRIEF §1) means 5–7
 * items per group — `groupSizeWarning` in the tests keeps that honest rather
 * than leaving it as advice nobody checks.
 *
 * Keyboard model:
 *   `/`          focus the search box (from anywhere in the palette)
 *   `ArrowDown`  next item, wrapping
 *   `ArrowUp`    previous item, wrapping
 *   `Enter`      insert the item under the cursor
 *   `Escape`     clear the search
 */

export interface PaletteItem {
  id: string;
  label: string;
  /** Extra words this item should match on — synonyms the label misses. */
  keywords?: string[];
  icon?: ComponentType<{ size?: number; "aria-hidden"?: boolean }>;
  disabled?: boolean;
  /** Why it is disabled. A disabled control with no reason is a dead end. */
  disabledReason?: string;
}

export interface PaletteGroup {
  id: string;
  label: string;
  items: PaletteItem[];
}

export interface StudioPaletteProps {
  groups: PaletteGroup[];
  /** Called when an item is inserted, by click or by Enter. */
  onInsert: (item: PaletteItem) => void;
  /** Placeholder for the search box. */
  searchPlaceholder?: string;
  /** Announced as the palette's region label. */
  label?: string;
}

const matches = (item: PaletteItem, query: string): boolean => {
  if (!query) return true;
  const q = query.toLowerCase();
  if (item.label.toLowerCase().includes(q)) return true;
  return (item.keywords || []).some((k) => k.toLowerCase().includes(q));
};

export const StudioPalette: FC<StudioPaletteProps> = ({
  groups,
  onInsert,
  searchPlaceholder = "Search…",
  label = "Palette",
}) => {
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const searchRef = useRef<HTMLInputElement | null>(null);

  const visible = useMemo(
    () =>
      groups
        .map((g) => ({ ...g, items: g.items.filter((i) => matches(i, query)) }))
        .filter((g) => g.items.length > 0),
    [groups, query],
  );

  // The cursor moves over the FLATTENED list, not per group: a user pressing
  // ArrowDown expects to cross a group boundary, not to stop at it.
  const flat = useMemo(() => visible.flatMap((g) => g.items), [visible]);

  // A filter that shortens the list must not leave the cursor past its end,
  // which would silently make Enter a no-op.
  useEffect(() => {
    setCursor((c) => (c >= flat.length ? 0 : c));
  }, [flat.length]);

  const insert = useCallback(
    (item: PaletteItem) => {
      if (item.disabled) return;
      onInsert(item);
    },
    [onInsert],
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "/" && e.target !== searchRef.current) {
        e.preventDefault();
        searchRef.current?.focus();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setCursor((c) => (flat.length === 0 ? 0 : (c + 1) % flat.length));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setCursor((c) =>
          flat.length === 0 ? 0 : (c - 1 + flat.length) % flat.length,
        );
        return;
      }
      if (e.key === "Enter") {
        const item = flat[cursor];
        if (item) {
          e.preventDefault();
          insert(item);
        }
        return;
      }
      if (e.key === "Escape" && query) {
        e.preventDefault();
        setQuery("");
      }
    },
    [flat, cursor, insert, query],
  );

  let index = -1;

  return (
    <div
      className={styles.palette}
      role="region"
      aria-label={label}
      onKeyDown={onKeyDown}
    >
      <div className={styles.search}>
        <input
          ref={searchRef}
          className={styles.searchInput}
          type="search"
          value={query}
          placeholder={searchPlaceholder}
          aria-label={`Search ${label.toLowerCase()}`}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className={styles.groups}>
        {visible.length === 0 ? (
          <p className={styles.empty}>
            Nothing matches “{query}”. Clear the search to see everything.
          </p>
        ) : (
          visible.map((group) => (
            <section key={group.id} aria-labelledby={`palette-group-${group.id}`}>
              <h3 className={styles.groupLabel} id={`palette-group-${group.id}`}>
                {group.label}
              </h3>
              <ul className={styles.list}>
                {group.items.map((item) => {
                  index += 1;
                  const isCursor = index === cursor;
                  const Icon = item.icon;
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        className={`${styles.item} ${isCursor ? styles.itemActive : ""}`}
                        disabled={item.disabled}
                        title={item.disabledReason}
                        // Roving tabindex: one stop for the whole list, so Tab
                        // leaves the palette instead of walking 60 blocks.
                        tabIndex={isCursor ? 0 : -1}
                        onClick={() => insert(item)}
                        onFocus={() => setCursor(flat.indexOf(item))}
                      >
                        {Icon ? (
                          <span className={styles.itemIcon}>
                            <Icon size={14} aria-hidden />
                          </span>
                        ) : null}
                        <span className={styles.itemLabel}>{item.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))
        )}
      </div>

      <p className={styles.hint}>
        <span className={styles.key}>/</span> search ·{" "}
        <span className={styles.key}>↑↓</span> move ·{" "}
        <span className={styles.key}>Enter</span> insert
      </p>
    </div>
  );
};
