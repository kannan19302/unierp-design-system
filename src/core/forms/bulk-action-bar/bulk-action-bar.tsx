"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { X, Check } from "lucide-react";
import { Button } from "../../primitives/button";
import styles from "./bulk-action-bar.module.css";

export interface BulkActionBarProps extends HTMLAttributes<HTMLDivElement> {
  selectedCount: number;
  actions: ReactNode;
  onClearSelection?: () => void;
  className?: string;
}

/**
 * `<BulkActionBar>` activates when one or more table items or ledger rows are checked,
 * presenting high-level bulk operations (export, batch approve, delete).
 *
 * @maturity stable
 */
export const BulkActionBar = forwardRef<HTMLDivElement, BulkActionBarProps>(
  (
    {
      selectedCount,
      actions,
      onClearSelection,
      className = "",
      ...restProps
    },
    ref
  ) => {
    if (selectedCount <= 0) return null;

    return (
      <div
        ref={ref}
        className={`${styles.bulkBar} ${className}`.trim()}
        role="toolbar"
        aria-label="Bulk actions"
        {...restProps}
      >
        <div className={styles.left}>
          <span className={styles.count}>
            {selectedCount} item{selectedCount > 1 ? "s" : ""} selected
          </span>
          {onClearSelection && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onClearSelection}
              aria-label="Clear selection"
            >
              <X size={14} aria-hidden="true" />
              <span>Clear selection</span>
            </Button>
          )}
        </div>
        <div className={styles.right}>{actions}</div>
      </div>
    );
  }
);

BulkActionBar.displayName = "BulkActionBar";

export interface ContextualSaveBarProps extends HTMLAttributes<HTMLDivElement> {
  visible: boolean;
  message?: ReactNode;
  onSave: () => void;
  onDiscard: () => void;
  isSaving?: boolean;
  saveLabel?: string;
  discardLabel?: string;
  className?: string;
}

/**
 * `<ContextualSaveBar>` anchors sticky operational awareness at the summit of records
 * alerting operators to unsaved dirty states and providing immediate commit or rollback controls.
 *
 * @maturity stable
 */
export const ContextualSaveBar = forwardRef<HTMLDivElement, ContextualSaveBarProps>(
  (
    {
      visible,
      message = "Unsaved changes in this voucher",
      onSave,
      onDiscard,
      isSaving = false,
      saveLabel = "Save changes",
      discardLabel = "Discard",
      className = "",
      ...restProps
    },
    ref
  ) => {
    if (!visible) return null;

    return (
      <div
        ref={ref}
        className={`${styles.contextualSaveBar} ${className}`.trim()}
        role="status"
        aria-live="polite"
        {...restProps}
      >
        <div className={styles.saveMessage}>
          <span className={styles.saveDot} />
          <span>{message}</span>
        </div>
        <div className={styles.saveActions}>
          <Button
            size="sm"
            variant="outline"
            onClick={onDiscard}
            disabled={isSaving}
          >
            {discardLabel}
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={onSave}
            isLoading={isSaving}
          >
            <Check size={14} aria-hidden="true" />
            <span>{saveLabel}</span>
          </Button>
        </div>
      </div>
    );
  }
);

ContextualSaveBar.displayName = "ContextualSaveBar";
