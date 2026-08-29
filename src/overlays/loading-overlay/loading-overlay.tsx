"use client";

import { type FC, type ReactNode } from "react";
import { Spinner } from "../../primitives/spinner";
import styles from "./loading-overlay.module.css";

export interface LoadingOverlayProps {
  visible: boolean;
  message?: ReactNode;
  blur?: boolean;
  className?: string;
}

export const LoadingOverlay: FC<LoadingOverlayProps> = ({
  visible,
  message = "Processing...",
  blur = true,
  className = "",
}) => {
  if (!visible) return null;

  return (
    <div
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
};
