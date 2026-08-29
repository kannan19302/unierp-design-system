"use client";

import {
  useState,
  useEffect,
  useRef,
  type FC,
  type ReactNode,
} from "react";
import { Search, Command, X } from "lucide-react";
import { Portal } from "../../overlays/portal";
import { useEscapeKey, useScrollLock } from "../../overlays/overlay-hooks";
import styles from "./command-palette.module.css";

export interface CommandItem {
  id: string;
  category: string;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  onSelect: () => void;
}

export interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  items: CommandItem[];
  placeholder?: string;
  className?: string;
}

export const CommandPalette: FC<CommandPaletteProps> = ({
  open,
  onClose,
  items,
  placeholder = "Search routes, records, or executive commands...",
  className = "",
}) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEscapeKey(onClose, open);
  useScrollLock(open);

  const filtered = items.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase()) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(query.toLowerCase()))
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + (filtered.length || 1)) % (filtered.length || 1));
      } else if (e.key === "Enter" && filtered[selectedIndex]) {
        e.preventDefault();
        filtered[selectedIndex]!.onSelect();
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose, filtered, selectedIndex]);

  if (!open) return null;

  return (
    <Portal>
      <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />
      <div className={styles.wrapper}>
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Command Palette"
          className={`${styles.dialog} ${className}`.trim()}
          tabIndex={-1}
        >
          <div className={styles.searchBar}>
            <Search size={16} className={styles.searchIcon} aria-hidden="true" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className={styles.input}
            />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close command palette"
              className={styles.closeBtn}
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>

          <div className={styles.list}>
            {filtered.length === 0 ? (
              <div className={styles.empty}>No matching commands or records found.</div>
            ) : (
              filtered.map((item, idx) => {
                const active = idx === selectedIndex;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      item.onSelect();
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`${styles.item} ${active ? styles.activeItem : ""}`}
                  >
                    <span className={styles.itemIcon}>
                      {item.icon || <Command size={14} aria-hidden="true" />}
                    </span>
                    <div className={styles.itemMeta}>
                      <div className={styles.itemTitle}>{item.title}</div>
                      {item.subtitle && (
                        <div className={styles.itemSubtitle}>{item.subtitle}</div>
                      )}
                    </div>
                    <span className={styles.itemCategory}>{item.category}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </Portal>
  );
};
