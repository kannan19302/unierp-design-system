"use client";

import { type FC, type ReactNode } from "react";
import { X, Check } from "lucide-react";
import { Button } from "../../primitives/button";
import styles from "./bulk-action-bar.module.css";

export interface BulkActionBarProps {
  selectedCount: number;
  actions: ReactNode;
  onClearSelection?: () => void;
  className?: string;
}

export const BulkActionBar: FC<BulkActionBarProps> = ({
  selectedCount,
  actions,
  onClearSelection,
  className = "",
}) => {
  if (selectedCount <= 0) return null;

  return (
    <div
      className={`${styles.bulkBar} ${className}`.trim()}
      role="toolbar"
      aria-label="Bulk actions"
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
};

export interface ContextualSaveBarProps {
  visible: boolean;
  message?: ReactNode;
  onSave: () => void;
  onDiscard: () => void;
  isSaving?: boolean;
  saveLabel?: string;
  discardLabel?: string;
  className?: string;
}

export const ContextualSaveBar: FC<ContextualSaveBarProps> = ({
  visible,
  message = "Unsaved changes in this voucher",
  onSave,
  onDiscard,
  isSaving = false,
  saveLabel = "Save changes",
  discardLabel = "Discard",
  className = "",
}) => {
  if (!visible) return null;

  return (
    <div
      className={`${styles.contextualSaveBar} ${className}`.trim()}
      role="status"
      aria-live="polite"
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
};
