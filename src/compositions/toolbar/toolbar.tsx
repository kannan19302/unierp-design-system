"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { Sparkles, MoreHorizontal, X } from "lucide-react";
import { Button } from "../../primitives/button";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import styles from "./toolbar.module.css";

export type ToolbarDensity = "ultra-compact" | "compact" | "standard" | "comfortable";

export const toolbarVariants = cva(styles.container, {
  variants: {
    density: {
      "ultra-compact": styles.densityUltraCompact,
      compact: styles.densityCompact,
      standard: styles.densityStandard,
      comfortable: styles.densityComfortable,
    },
  },
  defaultVariants: {
    density: "standard",
  },
});

export interface ActionItem {
  key: string;
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger" | "ghost" | "ai";
}

export interface ActionBarProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toolbarVariants> {
  primaryAction?: ActionItem;
  secondaryActions?: ActionItem[];
  aiAction?: ActionItem;
  overflowActions?: ActionItem[];
  leading?: ReactNode;
  selectedCount?: number;
  bulkActions?: ReactNode;
  onClearSelection?: () => void;
  density?: ToolbarDensity;
  className?: string;
}

/**
 * `<ActionBar>` coordinates record-level actions, batch mutations, and contextual AI workflows
 * at the boundary between table/record viewports and operator execution surfaces.
 *
 * @maturity stable
 */
export const ActionBar = forwardRef<HTMLDivElement, ActionBarProps>(
  (
    {
      primaryAction,
      secondaryActions = [],
      aiAction,
      overflowActions = [],
      leading,
      selectedCount = 0,
      bulkActions,
      onClearSelection,
      density = "standard",
      className = "",
      ...restProps
    },
    ref
  ) => {
    if (selectedCount > 0) {
      return (
        <div
          ref={ref}
          className={`${styles.bulkBar} ${styles[`density${density.charAt(0).toUpperCase() + density.slice(1).replace(/-([a-z])/g, (_, c) => c.toUpperCase())}`] || ""} ${className}`.trim()}
          role="toolbar"
          aria-label="Bulk actions"
          data-slot="toolbar-bulk"
          data-density={density}
          {...restProps}
        >
          <div className={styles.bulkLeft} data-slot="toolbar-bulk-left">
            <span className={styles.bulkCount} data-slot="toolbar-bulk-count">{selectedCount} selected</span>
            {onClearSelection && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onClearSelection}
                aria-label="Clear selection"
                data-slot="toolbar-bulk-deselect"
              >
                <X size={14} aria-hidden="true" />
                <span>Deselect</span>
              </Button>
            )}
          </div>

          <div className={styles.bulkRight} data-slot="toolbar-bulk-right">{bulkActions}</div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={`${toolbarVariants({ density })} ${className}`.trim()}
        role="toolbar"
        aria-label="Action bar"
        data-slot="toolbar"
        data-density={density}
        {...restProps}
      >
        <div className={styles.leftSection} data-slot="toolbar-leading">{leading}</div>

        <div className={styles.rightSection} data-slot="toolbar-actions">
          {aiAction && (
            <button
              type="button"
              className={styles.aiActionBtn}
              onClick={aiAction.onClick}
              disabled={aiAction.disabled}
              data-slot="toolbar-ai-action"
            >
              {aiAction.icon ?? <Sparkles size={14} aria-hidden="true" />}
              <span>{aiAction.label}</span>
            </button>
          )}

          {secondaryActions.map((action) => (
            <Button
              key={action.key}
              size="sm"
              variant={
                action.variant === "danger"
                  ? "danger"
                  : action.variant === "ghost"
                  ? "ghost"
                  : "secondary"
              }
              onClick={action.onClick}
              disabled={action.disabled}
              data-slot="toolbar-secondary-action"
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
              data-slot="toolbar-overflow-action"
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
              data-slot="toolbar-primary-action"
            >
              {primaryAction.icon}
              <span>{primaryAction.label}</span>
            </Button>
          )}
        </div>
      </div>
    );
  }
);

ActionBar.displayName = "ActionBar";

export const Toolbar = ActionBar;
Toolbar.displayName = "Toolbar";
export type ToolbarProps = ActionBarProps;
