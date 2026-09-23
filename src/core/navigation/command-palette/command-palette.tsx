"use client";

import React, {
  useState,
  useCallback,
  useEffect,
  useId,
  useRef,
  forwardRef,
  type ReactNode,
} from "react";
import { Search, Command, X } from "lucide-react";
import { Portal } from "../../overlays/portal";
import { FocusTrap } from "../../overlays/focus-trap";
import { useScrollLock } from "../../overlays/overlay-hooks";
import styles from "./command-palette.module.css";

export interface CommandItem {
  id: string;
  category: string;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  onSelect: () => void;
}

export interface CommandPaletteProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose: () => void;
  items: CommandItem[];
  placeholder?: string;
  className?: string;
}

/**
 * CommandPalette provides a global keyboard-first command search and dispatch dialog
 * for routes, actions, and administrative entities.
 *
 * @maturity stable
 */
export const CommandPalette = forwardRef<HTMLDivElement, CommandPaletteProps>(
  (
    {
      open,
      onClose,
      items,
      placeholder = "Search routes, records, or executive commands...",
      className = "",
      ...rest
    },
    ref
  ) => {
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const listId = useId();
    const closeRef = useRef(onClose);
    closeRef.current = onClose;
    const close = useCallback(() => closeRef.current(), []);

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
      if (!open) {
        setQuery("");
        setSelectedIndex(0);
      }
    }, [open]);

    const activeIndex = Math.min(selectedIndex, Math.max(0, filtered.length - 1));
    const activeOptionId = filtered[activeIndex] ? `${listId}-${activeIndex}` : undefined;

    useEffect(() => {
      if (open && activeOptionId) {
        document.getElementById(activeOptionId)?.scrollIntoView?.({ block: "nearest" });
      }
    }, [open, activeOptionId]);

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.nativeEvent.isComposing) return;
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedIndex((activeIndex + 1) % (filtered.length || 1));
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedIndex((activeIndex - 1 + (filtered.length || 1)) % (filtered.length || 1));
        } else if (e.key === "Enter" && filtered[activeIndex]) {
          e.preventDefault();
          filtered[activeIndex]!.onSelect();
          close();
        }
    };

    if (!open) return null;

    return (
      <Portal>
        <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />
        <div className={styles.wrapper}>
          <FocusTrap active={open} initialFocusRef={inputRef} onEscape={close}>
            <div
              ref={ref}
              role="dialog"
              aria-modal="true"
              aria-label="Command Palette"
              className={`${styles.dialog} ${className}`.trim()}
              tabIndex={-1}
              {...rest}
            >
              <div className={styles.searchBar}>
                <Search size={18} className={styles.searchIcon} aria-hidden="true" />
                <input
                  ref={inputRef}
                  type="text"
                  role="combobox"
                  aria-label="Search commands"
                  aria-autocomplete="list"
                  aria-controls={listId}
                  aria-expanded="true"
                  aria-activedescendant={activeOptionId}
                  onKeyDown={handleSearchKeyDown}
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

              <div id={listId} className={styles.list} role="listbox" aria-label="Command results">
                {filtered.length === 0 ? (
                  <div className={styles.empty} role="status">No matching commands or records found.</div>
                ) : (
                  filtered.map((item, idx) => {
                    const active = idx === activeIndex;
                    return (
                      <button
                        type="button"
                        id={`${listId}-${idx}`}
                        role="option"
                        aria-selected={active}
                        key={item.id}
                        onClick={() => {
                          item.onSelect();
                          onClose();
                        }}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        onFocus={() => setSelectedIndex(idx)}
                        className={`${styles.item} ${active ? styles.activeItem : ""}`}
                      >
                        <span className={styles.itemIcon}>
                          {item.icon || <Command size={16} aria-hidden="true" />}
                        </span>
                        <span className={styles.itemMeta}>
                          <span className={styles.itemTitle}>{item.title}</span>
                          {item.subtitle && <span className={styles.itemSubtitle}>{item.subtitle}</span>}
                        </span>
                        <span className={styles.itemCategory}>{item.category}</span>
                      </button>
                    );
                  })
                )}
              </div>
              <div className={styles.footer} aria-live="polite">
                <span>{filtered.length} {filtered.length === 1 ? "result" : "results"}</span>
                <span><kbd>↑</kbd><kbd>↓</kbd> Navigate <kbd>Enter</kbd> Open <kbd>Esc</kbd> Close</span>
              </div>
            </div>
          </FocusTrap>
        </div>
      </Portal>
    );
  }
);

CommandPalette.displayName = "CommandPalette";
