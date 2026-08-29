"use client";

import { useState, useMemo, type FC } from "react";
import { X, Search, Keyboard } from "lucide-react";
import { Portal } from "../portal";
import { useEscapeKey, useScrollLock } from "../overlay-hooks";
import {
  getRegisteredShortcuts,
  type ShortcutDefinition,
} from "../../hooks/use-keyboard-shortcuts";
import styles from "./shortcut-cheat-sheet.module.css";

export interface ShortcutCheatSheetProps {
  open: boolean;
  onClose: () => void;
  shortcuts?: ShortcutDefinition[];
  className?: string;
}

export const ShortcutCheatSheet: FC<ShortcutCheatSheetProps> = ({
  open,
  onClose,
  shortcuts,
  className = "",
}) => {
  const [filterQuery, setFilterQuery] = useState("");

  useEscapeKey(onClose, open);
  useScrollLock(open);

  const activeShortcuts = useMemo(() => {
    const list = shortcuts && shortcuts.length > 0 ? shortcuts : getRegisteredShortcuts();
    if (!filterQuery) return list;
    const q = filterQuery.toLowerCase();
    return list.filter(
      (s) =>
        s.description.toLowerCase().includes(q) ||
        s.keys.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
    );
  }, [shortcuts, filterQuery]);

  const grouped = useMemo(() => {
    const map: Record<string, ShortcutDefinition[]> = {};
    for (const s of activeShortcuts) {
      if (!map[s.category]) map[s.category] = [];
      map[s.category]!.push(s);
    }
    return map;
  }, [activeShortcuts]);

  if (!open) return null;

  const renderKeyBadges = (keyString: string) => {
    // Splits by spaces for sequences or '+' for combinations
    const isChord = keyString.includes(" ");
    if (isChord) {
      const keys = keyString.split(" ");
      return (
        <span className={styles.keySequence}>
          {keys.map((k, i) => (
            <span key={i} className={styles.keyUnit}>
              <kbd className={styles.kbd}>{k.toUpperCase()}</kbd>
              {i < keys.length - 1 && <span className={styles.chordThen}>then</span>}
            </span>
          ))}
        </span>
      );
    }

    const parts = keyString.split("+");
    return (
      <span className={styles.keyCombo}>
        {parts.map((p, i) => (
          <span key={i} className={styles.keyUnit}>
            <kbd className={styles.kbd}>{p.trim()}</kbd>
            {i < parts.length - 1 && <span className={styles.plus}>+</span>}
          </span>
        ))}
      </span>
    );
  };

  return (
    <Portal>
      <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />
      <div className={styles.wrapper}>
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Keyboard Shortcuts"
          className={`${styles.dialog} ${className}`.trim()}
          tabIndex={-1}
        >
          <div className={styles.header}>
            <div className={styles.titleGroup}>
              <Keyboard size={18} className={styles.headerIcon} aria-hidden="true" />
              <h2 className={styles.title}>Keyboard Shortcuts</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className={styles.closeBtn}
              aria-label="Close keyboard shortcuts dialog"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>

          <div className={styles.searchBar}>
            <Search size={14} className={styles.searchIcon} aria-hidden="true" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search shortcuts..."
              className={styles.searchInput}
              autoFocus
            />
          </div>

          <div className={styles.body}>
            {Object.keys(grouped).length === 0 ? (
              <div className={styles.empty}>No matching shortcuts found.</div>
            ) : (
              Object.entries(grouped).map(([category, items]) => (
                <div key={category} className={styles.section}>
                  <h3 className={styles.sectionTitle}>{category}</h3>
                  <div className={styles.grid}>
                    {items.map((item) => (
                      <div key={item.id} className={styles.row}>
                        <span className={styles.description}>{item.description}</span>
                        <div className={styles.keysWrapper}>{renderKeyBadges(item.keys)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className={styles.footer}>
            <span>Press <kbd className={styles.kbdSmall}>ESC</kbd> to exit</span>
          </div>
        </div>
      </div>
    </Portal>
  );
};
