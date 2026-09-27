"use client";

import { forwardRef, type ReactNode } from "react";
import { Spinner } from "../../primitives/spinner";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import styles from "./loading-overlay.module.css";

export const loadingOverlayVariants = cva(styles.overlay, {
  variants: {
    blur: {
      true: styles.blur,
      false: "",
    },
    density: {
      "ultra-compact": styles.densityUltraCompact,
      compact: styles.densityCompact,
      standard: styles.densityStandard,
      comfortable: styles.densityComfortable,
    },
  },
  defaultVariants: {
    blur: true,
    density: "standard",
  },
});

export interface LoadingOverlayProps
  extends VariantProps<typeof loadingOverlayVariants> {
  visible: boolean;
  message?: ReactNode;
  blur?: boolean;
  className?: string;
}

/**
 * LoadingOverlay component to block interaction and indicate ongoing operations.
 * Benchmarked against Mantine LoadingOverlay and Ant Design Spin.
 *
 * @maturity stable
 */
export const LoadingOverlay = forwardRef<HTMLDivElement, LoadingOverlayProps>(
  function LoadingOverlay(
    {
      visible,
      message = "Processing...",
      blur = true,
      density = "standard",
      className = "",
    },
    ref
  ) {
    if (!visible) return null;

    const spinnerSize =
      density === "ultra-compact" || density === "compact" ? "sm" : density === "comfortable" ? "lg" : "md";

    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        data-slot="loading-overlay"
        data-density={density}
        className={loadingOverlayVariants({ blur, density, className })}
      >
        <div data-slot="loading-overlay-dialog" className={styles.dialog}>
          <span data-slot="loading-overlay-spinner">
            <Spinner size={spinnerSize} />
          </span>
          {message && (
            <span data-slot="loading-overlay-message" className={styles.message}>
              {message}
            </span>
          )}
        </div>
      </div>
    );
  }
);

LoadingOverlay.displayName = "LoadingOverlay";
