"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { X } from "lucide-react";
import styles from "./tag.module.css";

export type TagShape = "rounded" | "pill";

/**
 * @maturity stable
 * @since 1.0.0
 * Strata DL Tag primitive — interactive dismissible label for categorization and entity filtering.
 */
export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  onRemove?: () => void;
  variant?: "default" | "primary" | "success" | "warning" | "danger" | "info";
  shape?: TagShape;
  className?: string;
}

export const Tag = forwardRef<HTMLSpanElement, TagProps>(({
  children,
  onRemove,
  variant = "default",
  shape = "rounded",
  className = "",
  ...props
}, ref) => {
  return (
    <span
      ref={ref}
      className={`${styles.tag} ${styles[variant]} ${styles[shape]} ${className}`.trim()}
      {...props}
    >
      <span className={styles.label}>{children}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove tag"
          className={styles.removeBtn}
        >
          <X size={10} aria-hidden="true" />
        </button>
      )}
    </span>
  );
});

Tag.displayName = "Tag";
