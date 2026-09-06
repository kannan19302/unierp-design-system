import React, { useEffect } from "react";
import styles from "./contextual-action-floating-dock.module.css";

export interface ContextualDockAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  isDanger?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export interface ContextualActionFloatingDockProps {
  selectedCount: number;
  actions: ContextualDockAction[];
  onDismiss?: () => void;
  isOpen?: boolean;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
  testId?: string;
}

export const ContextualActionFloatingDock: React.FC<ContextualActionFloatingDockProps> = ({
  selectedCount,
  actions,
  onDismiss,
  isOpen = true,
  density = "standard",
  className = "",
  testId = "contextual-action-floating-dock",
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && onDismiss) {
        onDismiss();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onDismiss]);

  if (!isOpen || selectedCount === 0) return null;

  return (
    <div
      className={`${styles.floatingDock ?? ""} ${className}`}
      data-density={density}
      data-testid={testId}
      role="toolbar"
      aria-label="Contextual Actions"
    >
      <span className={styles.countBadge ?? ""}>
        {selectedCount} selected
      </span>

      <ul className={styles.actionsList ?? ""} role="list">
        {actions.map((act) => (
          <li key={act.id}>
            <button
              type="button"
              className={`${styles.actionBtn ?? ""} ${act.isDanger ? (styles.actionDanger ?? "") : ""}`}
              onClick={act.onClick}
              disabled={act.disabled}
              aria-label={act.label}
            >
              {act.icon && <span aria-hidden="true">{act.icon}</span>}
              <span>{act.label}</span>
              {act.shortcut && (
                <kbd className={styles.kbd ?? ""}>{act.shortcut}</kbd>
              )}
            </button>
          </li>
        ))}
      </ul>

      {onDismiss && (
        <button
          type="button"
          className={styles.dismissBtn ?? ""}
          onClick={onDismiss}
          aria-label="Clear selection and dismiss dock (Esc)"
        >
          ✕
        </button>
      )}
    </div>
  );
};
