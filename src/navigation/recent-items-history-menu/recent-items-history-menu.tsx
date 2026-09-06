import React, { useState, useMemo } from "react";
import styles from "./recent-items-history-menu.module.css";

export interface RecentHistoryItem {
  id: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  module?: string;
  timestamp?: string;
  pinned?: boolean;
  href?: string;
}

export interface RecentItemsHistoryMenuProps {
  items: RecentHistoryItem[];
  onItemClick?: (item: RecentHistoryItem) => void;
  onTogglePin?: (itemId: string, pinned: boolean) => void;
  onClearHistory?: () => void;
  title?: string;
  searchPlaceholder?: string;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
  testId?: string;
}

export const RecentItemsHistoryMenu: React.FC<RecentItemsHistoryMenuProps> = ({
  items,
  onItemClick,
  onTogglePin,
  onClearHistory,
  title = "Recent Items",
  searchPlaceholder = "Search history...",
  density = "standard",
  className = "",
  testId = "recent-items-history-menu",
}) => {
  const [filterText, setFilterText] = useState("");

  const filteredItems = useMemo(() => {
    let result = items;
    if (filterText.trim()) {
      const q = filterText.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
          (item.module && item.module.toLowerCase().includes(q))
      );
    }
    // Sort pinned items first
    return [...result].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return 0;
    });
  }, [items, filterText]);

  return (
    <div
      className={`${styles.container} ${className}`}
      data-density={density}
      data-testid={testId}
      role="region"
      aria-label={title}
    >
      <div className={styles.header}>
        <h4 className={styles.title}>{title}</h4>
        {onClearHistory && (
          <button
            type="button"
            className={styles.clearBtn}
            onClick={onClearHistory}
            aria-label="Clear recent history"
          >
            Clear All
          </button>
        )}
      </div>

      <div className={styles.filterBox}>
        <input
          type="text"
          className={styles.filterInput}
          placeholder={searchPlaceholder}
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          aria-label={searchPlaceholder}
        />
      </div>

      {filteredItems.length === 0 ? (
        <div className={styles.emptyState}>No recent items found.</div>
      ) : (
        <ul className={styles.itemsList} role="list">
          {filteredItems.map((item) => (
            <li key={item.id}>
              <div className={styles.itemRow}>
                <button
                  type="button"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-2, 0.5rem)",
                    flex: 1,
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    textAlign: "left",
                    color: "inherit",
                  }}
                  onClick={() => onItemClick?.(item)}
                  aria-label={`${item.title}, ${item.subtitle || item.module || ""}`}
                >
                  {item.icon && <span className={styles.itemIcon} aria-hidden="true">{item.icon}</span>}
                  <div className={styles.itemText}>
                    <span className={styles.itemTitle}>{item.title}</span>
                    {(item.subtitle || item.module) && (
                      <span className={styles.itemSubtitle}>
                        {item.module ? `[${item.module}] ` : ""}
                        {item.subtitle}
                      </span>
                    )}
                  </div>
                </button>

                {onTogglePin && (
                  <button
                    type="button"
                    className={`${styles.pinBtn} ${item.pinned ? styles.pinned : ""}`}
                    onClick={() => onTogglePin(item.id, !item.pinned)}
                    aria-label={item.pinned ? `Unpin ${item.title}` : `Pin ${item.title}`}
                  >
                    ★
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
