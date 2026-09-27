"use client";

import React, { forwardRef } from "react";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import styles from "./bookmarks-bar.module.css";

export interface PinnedBookmark {
  id: string;
  label: string;
  icon?: React.ReactNode;
  hotkeyNumber?: number;
  isActive?: boolean;
}

export const bookmarksBarVariants = cva(styles.bookmarksBar, {
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

export interface PinnedBookmarksBarProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "onSelect">,
    VariantProps<typeof bookmarksBarVariants> {
  bookmarks: PinnedBookmark[];
  activeId?: string;
  onSelect?: (bookmark: PinnedBookmark) => void;
  onRemove?: (id: string) => void;
  onAddCurrent?: () => void;
  className?: string;
  testId?: string;
}

/**
 * PinnedBookmarksBar provides a browser-like persistent bookmark ribbon
 * for jumping to pinned workspace dashboards, records, and queries with keyboard hotkeys.
 * Benchmarked against Chrome/Edge Bookmarks Bar and Salesforce Navigation Tabs.
 *
 * @maturity stable
 */
export const PinnedBookmarksBar = forwardRef<HTMLElement, PinnedBookmarksBarProps>(
  (
    {
      bookmarks,
      activeId,
      onSelect,
      onRemove,
      onAddCurrent,
      density = "standard",
      className = "",
      testId = "pinned-bookmarks-bar",
      ...rest
    },
    ref
  ) => {
    return (
      <nav
        ref={ref}
        data-slot="bookmarks-bar"
        data-density={density}
        data-testid={testId}
        aria-label="Pinned Bookmarks"
        className={bookmarksBarVariants({ density, className })}
        {...rest}
      >
        <div className={styles.leftSection}>
          <span
            data-slot="bookmarks-bar-icon"
            className={styles.starIcon}
            aria-hidden="true"
          >
            ★
          </span>
          <ul
            data-slot="bookmarks-bar-list"
            className={styles.bookmarksList}
            role="list"
          >
            {bookmarks.map((b) => {
              const isSelected = activeId === b.id || b.isActive;
              return (
                <li
                  key={b.id}
                  data-slot="bookmarks-bar-item"
                  data-active={isSelected}
                  className={`${styles.bookmarkItem} ${isSelected ? styles.bookmarkActive : ""}`}
                >
                  <button
                    type="button"
                    data-slot="bookmarks-bar-button"
                    className={styles.bookmarkBtn}
                    onClick={() => onSelect?.(b)}
                    aria-label={b.label}
                    aria-current={isSelected ? "page" : undefined}
                  >
                    {b.icon && <span aria-hidden="true">{b.icon}</span>}
                    <span>{b.label}</span>
                    {typeof b.hotkeyNumber === "number" && (
                      <span
                        data-slot="bookmarks-bar-hotkey"
                        className={styles.hotkeyBadge}
                        aria-label={`Shortcut Ctrl plus ${b.hotkeyNumber}`}
                      >
                        ^{b.hotkeyNumber}
                      </span>
                    )}
                  </button>

                  {onRemove && (
                    <button
                      type="button"
                      data-slot="bookmarks-bar-remove"
                      className={styles.removeBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(b.id);
                      }}
                      aria-label={`Unpin ${b.label}`}
                    >
                      ✕
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {onAddCurrent && (
          <button
            type="button"
            data-slot="bookmarks-bar-add"
            className={styles.addBtn}
            onClick={onAddCurrent}
            aria-label="Pin current page"
          >
            <span>+</span>
            <span>Pin View</span>
          </button>
        )}
      </nav>
    );
  }
);

PinnedBookmarksBar.displayName = "PinnedBookmarksBar";
