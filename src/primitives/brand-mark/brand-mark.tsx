import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import styles from "./brand-mark.module.css";

/**
 * Class variance authority definitions for BrandMark.
 * Standardized across Carbon UI / Primer enterprise benchmark.
 */
export const brandMarkVariants = cva(styles.container, {
  variants: {
    size: {
      sm: styles.sm,
      md: styles.md,
      lg: styles.lg,
    },
    variant: {
      default: styles.variantDefault,
      monochrome: styles.variantMonochrome,
    },
  },
  defaultVariants: {
    size: "md",
    variant: "default",
  },
});

export interface BrandMarkProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof brandMarkVariants> {
  compact?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "monochrome";
  className?: string;
}

/**
 * `<BrandMark>` — Canonical UniERP product mark used across all web surfaces.
 * Standardized with cva, data-slot attributes, and Carbon/Primer enterprise benchmark.
 * @maturity stable
 */
export const BrandMark = forwardRef<HTMLSpanElement, BrandMarkProps>(
  (
    {
      compact = false,
      size = "md",
      variant = "default",
      className = "",
      ...props
    },
    ref,
  ) => {
    const pixels = size === "sm" ? 24 : size === "lg" ? 40 : 30;
    const containerClasses = brandMarkVariants({ size, variant, className });

    return (
      <span
        ref={ref}
        data-slot="brand-mark"
        data-size={size}
        data-variant={variant}
        data-compact={compact ? "true" : undefined}
        className={containerClasses}
        aria-label="UniERP"
        role="img"
        {...props}
      >
        <svg
          aria-hidden="true"
          data-slot="brand-mark-icon"
          width={pixels}
          height={pixels}
          viewBox="0 0 100 100"
          fill="none"
          className={styles.svg}
        >
          <rect
            width="100"
            height="100"
            rx="30"
            fill="var(--color-primary)"
          />
          <path
            d="M36 32V58C36 66.284 42.716 73 51 73C59.284 73 66 66.284 66 58V50"
            stroke="var(--color-text-inverse)"
            strokeWidth="15"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="66"
            cy="33"
            r="8"
            fill="var(--color-info)"
          />
        </svg>
        {!compact && (
          <span data-slot="brand-mark-text" className={styles.brandText}>
            Uni<span className={styles.erpAccent}>ERP</span>
          </span>
        )}
      </span>
    );
  },
);

BrandMark.displayName = "BrandMark";
