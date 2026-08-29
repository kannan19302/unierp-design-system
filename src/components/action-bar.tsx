"use client";

import { type FC, type ReactNode } from "react";
import { Sparkles, MoreHorizontal, X } from "lucide-react";
import { Button } from "./button";
import styles from "./action-bar.module.css";

export interface ActionItem {
  key: string;
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  /** Primary, secondary, danger, ghost, or AI-suggested */
  variant?: "primary" | "secondary" | "danger" | "ghost" | "ai";
}

export interface ActionBarProps {
  /** Main primary action (exactly one per view as per DL 2.0 §14) */
  primaryAction?: ActionItem;

  /** Secondary actions */
  secondaryActions?: ActionItem[];

  /** AI suggested action with sparkle indicator */
  aiAction?: ActionItem;

  /** Overflow actions placed into a dropdown menu */
  overflowActions?: ActionItem[];

  /** Left-aligned content (search input, filters, title, view toggle) */
  leading?: ReactNode;

  /** Bulk mode: if selectedCount > 0, switches to bulk action bar */
  selectedCount?: number;
  bulkActions?: ReactNode;
  onClearSelection?: () => void;

  className?: string;
}

/**
 * `<ActionBar>` — Action hierarchy enforcement component for DL 2.0.
 *
 * Enforces the strict action taxonomy:
 * Primary (1) → Secondary (N) → AI Suggested → Overflow (⋯) → Bulk (Selection Mode)
 */
export const ActionBar: FC<ActionBarProps> = ({
  primaryAction,
  secondaryActions = [],
  aiAction,
  overflowActions = [],
  leading,
  selectedCount = 0,
  bulkActions,
  onClearSelection,
  className = "",
}) => {
  // If items are selected, render the bulk action bar
  if (selectedCount > 0) {
    return (
      <div className={`${styles.bulkBar} ${className}`.trim()} role="toolbar" aria-label="Bulk actions">
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
          <span className={styles.bulkCount}>{selectedCount} selected</span>
          {onClearSelection && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onClearSelection}
              aria-label="Clear selection"
            >
              <X size={14} />
              <span>Deselect</span>
            </Button>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
          {bulkActions}
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${className}`.trim()} role="toolbar" aria-label="Action bar">
      <div className={styles.leftSection}>
        {leading}
      </div>

      <div className={styles.rightSection}>
        {/* AI Suggested Action */}
        {aiAction && (
          <button
            type="button"
            className={styles.aiActionBtn}
            onClick={aiAction.onClick}
            disabled={aiAction.disabled}
          >
            {aiAction.icon ?? <Sparkles size={14} />}
            <span>{aiAction.label}</span>
          </button>
        )}

        {/* Secondary Actions */}
        {secondaryActions.map((action) => (
          <Button
            key={action.key}
            size="sm"
            variant={action.variant === "danger" ? "danger" : action.variant === "ghost" ? "ghost" : "secondary"}
            onClick={action.onClick}
            disabled={action.disabled}
          >
            {action.icon}
            <span>{action.label}</span>
          </Button>
        ))}

        {/* Overflow Menu Action */}
        {overflowActions.length > 0 && (
          <Button
            size="sm"
            variant="ghost"
            aria-label="More actions"
            title="More actions"
          >
            <MoreHorizontal size={16} />
          </Button>
        )}

        {/* Primary Action */}
        {primaryAction && (
          <Button
            size="sm"
            variant="primary"
            onClick={primaryAction.onClick}
            disabled={primaryAction.disabled}
          >
            {primaryAction.icon}
            <span>{primaryAction.label}</span>
          </Button>
        )}
      </div>
    </div>
  );
};
