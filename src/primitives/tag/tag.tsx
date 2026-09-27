import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { X } from "lucide-react";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import styles from "./tag.module.css";

export const tagVariants = cva(styles.tag, {
  variants: {
    variant: {
      default: styles.default,
      primary: styles.primary,
      success: styles.success,
      warning: styles.warning,
      danger: styles.danger,
      info: styles.info,
    },
    shape: {
      rounded: styles.rounded,
      pill: styles.pill,
    },
  },
  defaultVariants: {
    variant: "default",
    shape: "rounded",
  },
});

export type TagShape = "rounded" | "pill";
export type TagVariant = "default" | "primary" | "success" | "warning" | "danger" | "info";

/**
 * @maturity stable
 * @since 1.0.0
 * Strata DL Tag primitive — interactive dismissible label for categorization and entity filtering.
 * Standardized with cva, data-slot, and W3C APG token/chip pattern.
 */
export interface TagProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof tagVariants> {
  children: ReactNode;
  onRemove?: () => void;
  variant?: TagVariant;
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
  const rootClass = `${tagVariants({ variant, shape })} ${className}`.trim();

  return (
    <span
      ref={ref}
      data-slot="tag"
      data-variant={variant}
      data-shape={shape}
      className={rootClass}
      {...props}
    >
      <span data-slot="tag-label" className={styles.label}>{children}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove tag"
          data-slot="tag-remove"
          className={styles.removeBtn}
        >
          <X size={10} aria-hidden="true" />
        </button>
      )}
    </span>
  );
});

Tag.displayName = "Tag";
