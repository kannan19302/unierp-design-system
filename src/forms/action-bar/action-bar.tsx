"use client";

import { type FC, type ReactNode } from "react";
import { Sparkles, MoreHorizontal, X } from "lucide-react";
import { Button } from "../../primitives/button";
import styles from "./action-bar.module.css";

export interface ActionItem {
  key: string;
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger" | "ghost" | "ai";
}

export interface ActionBarProps {
  primaryAction?: ActionItem;
  secondaryActions?: ActionItem[];
  aiAction?: ActionItem;
  overflowActions?: ActionItem[];
  leading?: ReactNode;
  selectedCount?: number;
  bulkActions?: ReactNode;
  onClearSelection?: () => void;
  className?: string;
}

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
  if (selectedCount > 0) {
    return (
      <div className={`${styles.bulkBar} ${className}`.trim()} role="toolbar" aria-label="Bulk actions">
        <div className={styles.bulkLeft}>
          <span className={styles.bulkCount}>{selectedCount} selected</span>
          {onClearSelection && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onClearSelection}
              aria-label="Clear selection"
            >
              <X size={14} aria-hidden="true" />
              <span>Deselect</span>
            </Button>
          )}
        </div>

        <div className={styles.bulkRight}>
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
        {aiAction && (
          <button
            type="button"
            className={styles.aiActionBtn}
            onClick={aiAction.onClick}
            disabled={aiAction.disabled}
          >
            {aiAction.icon ?? <Sparkles size={14} aria-hidden="true" />}
            <span>{aiAction.label}</span>
          </button>
        )}

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

        {overflowActions.length > 0 && (
          <Button
            size="sm"
            variant="ghost"
            aria-label="More actions"
            title="More actions"
          >
            <MoreHorizontal size={16} aria-hidden="true" />
          </Button>
        )}

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
