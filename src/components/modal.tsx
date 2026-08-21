"use client";

import { useState, type FC, type ReactNode } from "react";
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
}: any) => {
  // Callback ref into state, not useRef: the dialog renders inside <Portal>,
  // which mounts its children in a later commit of its own, and flipping that
  // flag re-renders Portal rather than this component — so a ref object would
  // still read null when the effects here run and would never notify us when
  // it filled in. See useFocusTrap's note in overlays.tsx.
  const [dialog, setDialog] = useState<HTMLDivElement | null>(null);

  useEscapeKey(onClose, open);
  useFocusTrap(dialog, open);
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
        ref={setDialog}
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

  // Always portalled — including under test. This used to return `content`
  // inline when NODE_ENV === "test", to dodge `useFocusTrap` seeing a null ref
  // because <Portal> mounts its children one commit later. That hid the real
  // defect (the trap never armed anywhere, in tests OR in the browser) behind
  // an env branch, and meant tests exercised a different tree than production.
  // useFocusTrap now handles late-mounting portals directly, so the branch is
  // gone and the test renders exactly what a user gets.
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
}: any) => (
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
