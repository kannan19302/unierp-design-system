import React from "react";
import styles from "./pinned-bookmarks-bar.module.css";

export interface PinnedBookmark {
  id: string;
  label: string;
  icon?: React.ReactNode;
  hotkeyNumber?: number;
  isActive?: boolean;
}

export interface PinnedBookmarksBarProps {
  bookmarks: PinnedBookmark[];
  activeId?: string;
  onSelect?: (bookmark: PinnedBookmark) => void;
  onRemove?: (id: string) => void;
  onAddCurrent?: () => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
  testId?: string;
}

export const PinnedBookmarksBar: React.FC<PinnedBookmarksBarProps> = ({
  bookmarks,
  activeId,
  onSelect,
  onRemove,
  onAddCurrent,
  density = "standard",
  className = "",
  testId = "pinned-bookmarks-bar",
}) => {
  return (
    <nav
      className={`${styles.bookmarksBar ?? ""} ${className}`}
      data-density={density}
      data-testid={testId}
      aria-label="Pinned Bookmarks"
    >
      <div className={styles.leftSection ?? ""}>
        <span className={styles.starIcon ?? ""} aria-hidden="true">
          ★
        </span>
        <ul className={styles.bookmarksList ?? ""} role="list">
          {bookmarks.map((b) => {
            const isSelected = activeId === b.id || b.isActive;
            return (
              <li
                key={b.id}
                className={`${styles.bookmarkItem ?? ""} ${isSelected ? (styles.bookmarkActive ?? "") : ""}`}
              >
                <button
                  type="button"
                  className={styles.bookmarkBtn ?? ""}
                  onClick={() => onSelect?.(b)}
                  aria-label={b.label}
                  aria-current={isSelected ? "page" : undefined}
                >
                  {b.icon && <span aria-hidden="true">{b.icon}</span>}
                  <span>{b.label}</span>
                  {typeof b.hotkeyNumber === "number" && (
                    <span className={styles.hotkeyBadge ?? ""} aria-label={`Shortcut Ctrl plus ${b.hotkeyNumber}`}>
                      ^{b.hotkeyNumber}
                    </span>
                  )}
                </button>

                {onRemove && (
                  <button
                    type="button"
                    className={styles.removeBtn ?? ""}
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
          className={styles.addBtn ?? ""}
          onClick={onAddCurrent}
          aria-label="Pin current page"
        >
          <span>+</span>
          <span>Pin View</span>
        </button>
      )}
    </nav>
  );
};
