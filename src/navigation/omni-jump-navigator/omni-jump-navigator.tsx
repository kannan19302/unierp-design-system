import React, { useState, useMemo, useEffect } from "react";
import styles from "./omni-jump-navigator.module.css";

export type OmniJumpPrefix = "@" | "#" | "!" | ">" | "";

export interface OmniJumpItem {
  id: string;
  title: string;
  subtitle?: string;
  prefix: OmniJumpPrefix;
  category: string;
  icon?: React.ReactNode;
  shortcut?: string;
}

export interface OmniJumpNavigatorProps {
  items: OmniJumpItem[];
  isOpen?: boolean;
  onClose?: () => void;
  onSelect?: (item: OmniJumpItem) => void;
  placeholder?: string;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
  testId?: string;
}

const PREFIX_CONFIG: { prefix: OmniJumpPrefix; label: string; description: string }[] = [
  { prefix: "", label: "All", description: "Search everything" },
  { prefix: "@", label: "@ People", description: "Colleagues & Approvers" },
  { prefix: "#", label: "# Workspaces", description: "Spaces & Projects" },
  { prefix: "!", label: "! Records", description: "Transactions & IDs" },
  { prefix: ">", label: "> Views", description: "Dashboards & Ledgers" },
];

export const OmniJumpNavigator: React.FC<OmniJumpNavigatorProps> = ({
  items,
  isOpen = true,
  onClose,
  onSelect,
  placeholder = "Jump to anything... (@ people, # workspaces, ! records, > views)",
  density = "standard",
  className = "",
  testId = "omni-jump-navigator",
}) => {
  const [query, setQuery] = useState("");
  const [activePrefix, setActivePrefix] = useState<OmniJumpPrefix>("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && onClose) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Extract prefix if user types it directly as the first character
  const effectivePrefix: OmniJumpPrefix = useMemo(() => {
    const trimmed = query.trim();
    if (trimmed.startsWith("@")) return "@";
    if (trimmed.startsWith("#")) return "#";
    if (trimmed.startsWith("!")) return "!";
    if (trimmed.startsWith(">")) return ">";
    return activePrefix;
  }, [query, activePrefix]);

  const cleanQuery = useMemo(() => {
    const trimmed = query.trim();
    if (trimmed.startsWith("@") || trimmed.startsWith("#") || trimmed.startsWith("!") || trimmed.startsWith(">")) {
      return trimmed.slice(1).trim().toLowerCase();
    }
    return trimmed.toLowerCase();
  }, [query]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (effectivePrefix && item.prefix !== effectivePrefix) {
        return false;
      }
      if (!cleanQuery) return true;
      return (
        item.title.toLowerCase().includes(cleanQuery) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(cleanQuery)) ||
        item.category.toLowerCase().includes(cleanQuery)
      );
    });
  }, [items, effectivePrefix, cleanQuery]);

  const handleKeyDownInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (filteredItems.length > 0 ? (prev + 1) % filteredItems.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (filteredItems.length > 0 ? (prev - 1 + filteredItems.length) % filteredItems.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        onSelect?.(filteredItems[selectedIndex]);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay ?? ""}
      onClick={onClose}
      data-testid={`${testId}-overlay`}
    >
      <div
        className={`${styles.modal ?? ""} ${className}`}
        data-density={density}
        data-testid={testId}
        role="dialog"
        aria-modal="true"
        aria-label="Omni Jump Navigator"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.inputSection ?? ""}>
          <span className={styles.prefixIcon ?? ""} aria-hidden="true">
            {effectivePrefix || "⌕"}
          </span>
          <input
            type="text"
            className={styles.input ?? ""}
            placeholder={placeholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDownInput}
            aria-label="Search destination"
            autoFocus
          />
        </div>

        <div className={styles.prefixChips ?? ""} role="tablist" aria-label="Prefix categories">
          {PREFIX_CONFIG.map((cfg) => {
            const isActive = effectivePrefix === cfg.prefix;
            return (
              <button
                key={cfg.prefix || "all"}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`${styles.chip ?? ""} ${isActive ? (styles.chipActive ?? "") : ""}`}
                onClick={() => {
                  setActivePrefix(cfg.prefix);
                  setQuery("");
                  setSelectedIndex(0);
                }}
              >
                {cfg.label}
              </button>
            );
          })}
        </div>

        <ul className={styles.resultsList ?? ""} role="list" aria-label="Search results">
          {filteredItems.length === 0 ? (
            <li style={{ padding: "var(--space-4, 1rem)", textAlign: "center", color: "var(--color-text-secondary, #64748b)" }}>
              No matches found for &quot;{query}&quot;
            </li>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`${styles.resultItem ?? ""} ${isSelected ? (styles.resultItemActive ?? "") : ""}`}
                    onClick={() => onSelect?.(item)}
                    data-selected={isSelected}
                  >
                    <div className={styles.itemLeft ?? ""}>
                      {item.icon && <span className={styles.itemIcon ?? ""} aria-hidden="true">{item.icon}</span>}
                      <div className={styles.itemText ?? ""}>
                        <span className={styles.itemTitle ?? ""}>{item.title}</span>
                        {item.subtitle && <span className={styles.itemSubtitle ?? ""}>{item.subtitle}</span>}
                      </div>
                    </div>
                    <span className={styles.itemCategory ?? ""}>{item.category}</span>
                  </button>
                </li>
              );
            })
          )}
        </ul>

        <div className={styles.footer ?? ""}>
          <span className={styles.shortcutHint ?? ""}>
            <kbd className={styles.kbd ?? ""}>↑</kbd>
            <kbd className={styles.kbd ?? ""}>↓</kbd> to navigate
          </span>
          <span className={styles.shortcutHint ?? ""}>
            <kbd className={styles.kbd ?? ""}>↵</kbd> to jump
          </span>
          <span className={styles.shortcutHint ?? ""}>
            <kbd className={styles.kbd ?? ""}>Esc</kbd> to close
          </span>
        </div>
      </div>
    </div>
  );
};
