import React, { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import styles from "./visually-hidden.module.css";

export const visuallyHiddenVariants = cva(styles.visuallyHidden, {
  variants: {},
  defaultVariants: {},
});

export interface VisuallyHiddenProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof visuallyHiddenVariants> {
  children?: React.ReactNode;
}

/**
 * `<VisuallyHidden>` — Screen-reader-only accessible announcement primitive.
 * Standardized with cva, data-slot, and W3C APG clip-rect technique.
 * @maturity stable
 */
export const VisuallyHidden = forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  ({ className = "", children, ...props }, ref) => (
    <span
      ref={ref}
      data-slot="visually-hidden"
      className={`${visuallyHiddenVariants({})} ${className}`.trim()}
      {...props}
    >
      {children}
    </span>
  )
);

VisuallyHidden.displayName = "VisuallyHidden";
