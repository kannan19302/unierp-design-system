"use client";

import { type FC, type ReactNode } from "react";
import { X } from "lucide-react";
import styles from "./tag.module.css";

export type TagShape = "rounded" | "pill";

export interface TagProps {
  children: ReactNode;
  onRemove?: () => void;
  variant?: "default" | "primary" | "success" | "warning" | "danger" | "info";
  shape?: TagShape;
  className?: string;
}

export const Tag: FC<TagProps> = ({
  children,
  onRemove,
  variant = "default",
  shape = "rounded",
  className = "",
}) => {
  return (
    <span className={`${styles.tag} ${styles[variant]} ${styles[shape]} ${className}`.trim()}>
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
};
