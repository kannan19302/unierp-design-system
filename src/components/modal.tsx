"use client";

import { useRef, type FC, type ReactNode } from "react";
import { Portal, useEscapeKey, useFocusTrap, useScrollLock } from "./overlays";
import { X } from "lucide-react";
import { Button } from "./button";
import styles from "./modal.module.css";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  footer?: ReactNode;
  children?: ReactNode;
  closeOnOverlay?: boolean;
}

/** Accessible modal using shared overlay primitives. */
export const Modal: FC<ModalProps> = ({
  open,
  onClose,
  title,
  description,
  size = "md",
  footer,
  children,
  closeOnOverlay = true,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEscapeKey(onClose, open);
  useFocusTrap(dialogRef, open);
  useScrollLock(open);

  const dialogClass = [styles.dialog, styles[size]].join(" ");

  if (!open) return null;

  const content = (
    <>
      {/* Backdrop */}
      <div
        className={styles.backdrop}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background: "rgba(0, 0, 0, 0.4)",
        }}
        onClick={closeOnOverlay ? onClose : undefined}
        aria-hidden="true"
      />
      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        className={dialogClass}
        tabIndex={-1}
        style={{ zIndex: 10000 }}
      >
        {(title || description) && (
          <div className={styles.header}>
            <div>
              {title && (
                <h2 id="modal-title" className={styles.title}>
                  {title}
                </h2>
              )}
              {description && <p className={styles.description}>{description}</p>}
            </div>
            <button
              onClick={onClose}
              className={styles.close_btn}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        )}
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </>
  );

  // In test environment render inline
  if (process.env.NODE_ENV === "test") {
    return content;
  }

  return <Portal>{content}</Portal>;
};

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "primary" | "danger";
  loading?: boolean;
}

/** Confirmation dialog — error prevention (Nielsen #5) for destructive/irreversible actions. */
export const ConfirmDialog: FC<ConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "primary",
  loading,
}) => (
  <Modal
    open={open}
    onClose={onClose}
    title={title}
    size="sm"
    footer={
      <>
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button
          variant={variant === "danger" ? "danger" : "primary"}
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? "Working…" : confirmLabel}
        </Button>
      </>
    }
  >
    {message && <div className={styles.confirm_msg}>{message}</div>}
  </Modal>
);
