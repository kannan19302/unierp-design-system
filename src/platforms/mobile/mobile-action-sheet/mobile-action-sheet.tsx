import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import styles from "./mobile-action-sheet.module.css";

export interface ActionSheetOption {
  id: string;
  label: string;
  icon?: ReactNode;
  isDestructive?: boolean;
  onSelect: () => void;
}

export interface MobileActionSheetProps extends HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean;
  title?: string;
  options?: ActionSheetOption[];
  onCancel?: () => void;
}

export const MobileActionSheet = forwardRef<HTMLDivElement, MobileActionSheetProps>(
  (
    {
      isOpen = true,
      title = "Select Action",
      options = [
        { id: "edit", label: "Edit Record", onSelect: () => {} },
        { id: "share", label: "Share Link", onSelect: () => {} },
        { id: "delete", label: "Delete Permanently", isDestructive: true, onSelect: () => {} },
      ],
      onCancel,
      className = "",
      ...props
    },
    ref
  ) => {
    if (!isOpen) return null;

    return (
      <div className={styles.overlay} role="dialog" aria-modal="true" aria-label={title}>
        <div ref={ref} className={`${styles.sheet} ${className}`} {...props}>
          <div className={styles.handle} aria-hidden="true" />

          {title && <h3 className={styles.title}>{title}</h3>}

          <div className={styles.optionList} role="menu">
            {options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                role="menuitem"
                className={`${styles.optionBtn} ${opt.isDestructive ? styles.destructive : ""}`}
                onClick={opt.onSelect}
              >
                {opt.icon && <span className={styles.optIcon}>{opt.icon}</span>}
                <span className={styles.optLabel}>{opt.label}</span>
              </button>
            ))}
          </div>

          {onCancel && (
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    );
  }
);

MobileActionSheet.displayName = "MobileActionSheet";
