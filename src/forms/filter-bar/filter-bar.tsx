"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { Filter, X } from "lucide-react";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import styles from "./filter-bar.module.css";

export const filterBarVariants = cva(styles.filterBar, {
  variants: {
    density: {
      "ultra-compact": styles.densityUltraCompact,
      compact: styles.densityCompact,
      standard: styles.densityStandard,
      comfortable: styles.densityComfortable,
    },
  },
  defaultVariants: {
    density: "standard",
  },
});

export type FilterBarDensity = "ultra-compact" | "compact" | "standard" | "comfortable";

export interface FilterTagProps extends HTMLAttributes<HTMLSpanElement> {
  label: string;
  value: string;
  onRemove?: () => void;
  density?: FilterBarDensity;
}

/**
 * `<FilterTag>` displays an individual discrete criterion pill with dismissible action.
 *
 * @maturity stable
 */
export const FilterTag = forwardRef<HTMLSpanElement, FilterTagProps>(
  ({ label, value, onRemove, density, className = "", ...restProps }, ref) => (
    <span
      ref={ref}
      data-slot="filter-tag"
      data-density={density}
      className={`${styles.tag} ${className}`.trim()}
      {...restProps}
    >
      <span className={styles.tagLabel} data-slot="filter-tag-label">{label}:</span>
      <span className={styles.tagValue} data-slot="filter-tag-value">{value}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove filter ${label}`}
          className={styles.tagRemoveBtn}
          data-slot="filter-tag-remove"
        >
          <X size={12} aria-hidden="true" />
        </button>
      )}
    </span>
  )
);

FilterTag.displayName = "FilterTag";

export interface FilterBarProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof filterBarVariants> {
  children: ReactNode;
  onClearAll?: () => void;
  density?: FilterBarDensity;
  className?: string;
}

/**
 * `<FilterBar>` aggregates active search filters, facets, and query predicates
 * into a horizontal token ribbon with bulk clear action.
 *
 * @maturity stable
 */
export const FilterBar = forwardRef<HTMLDivElement, FilterBarProps>(
  ({ children, onClearAll, density = "standard", className = "", ...restProps }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="filter-bar"
        data-density={density}
        className={filterBarVariants({ density, className })}
        role="region"
        aria-label="Filters"
        {...restProps}
      >
        <div className={styles.filterLabel} data-slot="filter-bar-label">
          <Filter size={13} className={styles.filterIcon} data-slot="filter-bar-icon" aria-hidden="true" />
          <span>Filters:</span>
        </div>
        <div className={styles.filterContent} data-slot="filter-bar-content">{children}</div>
        {onClearAll && (
          <button
            type="button"
            onClick={onClearAll}
            className={styles.clearBtn}
            data-slot="filter-bar-clear"
          >
            Clear all
          </button>
        )}
      </div>
    );
  }
);

FilterBar.displayName = "FilterBar";
