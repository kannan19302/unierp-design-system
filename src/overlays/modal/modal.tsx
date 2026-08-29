"use client";

import { useState, type FC, type ReactNode } from "react";
import { X } from "lucide-react";
import { Portal } from "../portal";
import { useEscapeKey, useFocusTrap, useScrollLock } from "../overlay-hooks";
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
  className?: string;
}

export const Modal: FC<ModalProps> = ({
  open,
  onClose,
  title,
  description,
  size = "md",
  footer,
  children,
  closeOnOverlay = true,
  className = "",
}) => {
  const [dialog, setDialog] = useState<HTMLDivElement | null>(null);

  useEscapeKey(onClose, open);
  useFocusTrap(dialog, open);
  useScrollLock(open);

  if (!open) return null;

  const dialogClass = [styles.dialog, styles[size], className]
    .filter(Boolean)
    .join(" ");

  return (
    <Portal>
      <div
        className={styles.backdrop}
        onClick={closeOnOverlay ? onClose : undefined}
        aria-hidden="true"
      />
      <div
        ref={setDialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        className={dialogClass}
        tabIndex={-1}
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
              type="button"
              onClick={onClose}
              className={styles.closeBtn}
              aria-label="Close"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        )}
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </Portal>
  );
};
