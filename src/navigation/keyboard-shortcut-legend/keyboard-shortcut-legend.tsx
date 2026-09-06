import React, { useState, useMemo, useEffect } from "react";
import styles from "./keyboard-shortcut-legend.module.css";

export interface KeyboardShortcutItem {
  id: string;
  label: string;
  keys: string[];
  category?: string;
}

export interface KeyboardShortcutLegendProps {
  shortcuts: KeyboardShortcutItem[];
  isOpen?: boolean;
  onClose?: () => void;
  title?: string;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
  testId?: string;
}

export const KeyboardShortcutLegend: React.FC<KeyboardShortcutLegendProps> = ({
  shortcuts,
  isOpen = true,
  onClose,
  title = "Keyboard Shortcuts",
  density = "standard",
  className = "",
  testId = "keyboard-shortcut-legend",
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && onClose) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const filteredShortcuts = useMemo(() => {
    if (!searchQuery.trim()) return shortcuts;
    const q = searchQuery.toLowerCase();
    return shortcuts.filter(
      (s) =>
        s.label.toLowerCase().includes(q) ||
        (s.category && s.category.toLowerCase().includes(q)) ||
        s.keys.some((k) => k.toLowerCase().includes(q))
    );
  }, [shortcuts, searchQuery]);

  const grouped = useMemo(() => {
    const map = new Map<string, KeyboardShortcutItem[]>();
    filteredShortcuts.forEach((item) => {
      const cat = item.category || "General";
      if (!map.has(cat)) {
        map.set(cat, []);
      }
      map.get(cat)!.push(item);
    });
    return Array.from(map.entries());
  }, [filteredShortcuts]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      data-testid={`${testId}-overlay`}
    >
      <div
        className={`${styles.modal} ${className}`}
        data-density={density}
        data-testid={testId}
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcut-legend-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h3 id="shortcut-legend-title" className={styles.title}>
            {title}
          </h3>
          {onClose && (
            <button
              type="button"
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Close keyboard shortcuts dialog"
            >
              ✕
            </button>
          )}
        </div>

        <div className={styles.searchBar}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Filter shortcuts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Filter shortcuts"
          />
        </div>

        <div className={styles.body}>
          {grouped.length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--color-text-secondary, #64748b)" }}>
              No shortcuts found.
            </p>
          ) : (
            grouped.map(([category, items]) => (
              <div key={category} className={styles.sectionGroup}>
                <h4 className={styles.sectionTitle}>{category}</h4>
                <ul className={styles.shortcutList} role="list">
                  {items.map((shortcut) => (
                    <li key={shortcut.id} className={styles.shortcutRow}>
                      <span className={styles.shortcutLabel}>{shortcut.label}</span>
                      <div className={styles.keysContainer}>
                        {shortcut.keys.map((k, idx) => (
                          <kbd key={idx} className={styles.kbd}>
                            {k}
                          </kbd>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>

        <div className={styles.footer}>
          Press <kbd className={styles.kbd}>Esc</kbd> to dismiss
        </div>
      </div>
    </div>
  );
};
