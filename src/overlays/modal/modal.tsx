"use client";

import { useState, useId, type FC, type ReactNode } from "react";
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
  /** Accessible name when no visible title is present */
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
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
  "aria-label": ariaLabel,
  "aria-labelledby": customAriaLabelledBy,
  "aria-describedby": customAriaDescribedBy,
}) => {
  const [dialog, setDialog] = useState<HTMLDivElement | null>(null);
  const autoId = useId();
  const titleId = title ? `modal-title-${autoId}` : undefined;
  const descId = description ? `modal-desc-${autoId}` : undefined;

  useEscapeKey(onClose, open);
  useFocusTrap(dialog, open);
  useScrollLock(open);

  if (!open) return null;

  const dialogClass = [styles.dialog, styles[size], className]
    .filter(Boolean)
    .join(" ");

  const resolvedLabelledBy = customAriaLabelledBy ?? titleId;
  const resolvedDescribedBy = customAriaDescribedBy ?? descId;

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
        aria-labelledby={resolvedLabelledBy}
        aria-describedby={resolvedDescribedBy}
        aria-label={!resolvedLabelledBy ? (ariaLabel ?? (typeof title === "string" ? title : undefined)) : undefined}
        className={dialogClass}
        tabIndex={-1}
      >
        {(title || description) && (
          <div className={styles.header}>
            <div>
              {title && (
                <h2 id={titleId} className={styles.title}>
                  {title}
                </h2>
              )}
              {description && (
                <p id={descId} className={styles.description}>
                  {description}
                </p>
              )}
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
