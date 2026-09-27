"use client";

import React, { forwardRef, type HTMLAttributes } from "react";
import styles from "./visually-hidden.module.css";

export interface VisuallyHiddenProps extends HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
}

/**
 * VisuallyHidden — Screen-reader-only accessible announcement primitive.
 */
export const VisuallyHidden = forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  ({ className = "", children, ...props }, ref) => (
    <span
      ref={ref}
      className={`${styles.visuallyHidden} ${className}`.trim()}
      {...props}
    >
      {children}
    </span>
  )
);

VisuallyHidden.displayName = "VisuallyHidden";
