"use client";

import { forwardRef, type ReactNode } from "react";
import { Spinner } from "../../primitives/spinner";
import styles from "./loading-overlay.module.css";

export interface LoadingOverlayProps {
  visible: boolean;
  message?: ReactNode;
  blur?: boolean;
  className?: string;
}

/**
 * LoadingOverlay component to block interaction and indicate ongoing operations.
 *
 * @maturity stable
 */
export const LoadingOverlay = forwardRef<HTMLDivElement, LoadingOverlayProps>(function LoadingOverlay(
  {
    visible,
    message = "Processing...",
    blur = true,
    className = "",
  },
  ref
) {
  if (!visible) return null;

  return (
    <div
      ref={ref}
      role="status"
      aria-live="polite"
      className={`${styles.overlay} ${blur ? styles.blur : ""} ${className}`.trim()}
    >
      <div className={styles.dialog}>
        <Spinner size="md" />
        {message && <span className={styles.message}>{message}</span>}
      </div>
    </div>
  );
});

LoadingOverlay.displayName = "LoadingOverlay";
