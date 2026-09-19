"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { Filter, X } from "lucide-react";
import styles from "./filter-bar.module.css";

export interface FilterTagProps extends HTMLAttributes<HTMLSpanElement> {
  label: string;
  value: string;
  onRemove?: () => void;
}

/**
 * `<FilterTag>` displays an individual discrete criterion pill with dismissible action.
 *
 * @maturity stable
 */
export const FilterTag = forwardRef<HTMLSpanElement, FilterTagProps>(
  ({ label, value, onRemove, className = "", ...restProps }, ref) => (
    <span
      ref={ref}
      className={`${styles.tag} ${className}`.trim()}
      {...restProps}
    >
      <span className={styles.tagLabel}>{label}:</span>
      <span className={styles.tagValue}>{value}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove filter ${label}`}
          className={styles.tagRemoveBtn}
        >
          <X size={12} aria-hidden="true" />
        </button>
      )}
    </span>
  )
);

FilterTag.displayName = "FilterTag";

export interface FilterBarProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  onClearAll?: () => void;
  className?: string;
}

/**
 * `<FilterBar>` aggregates active search filters, facets, and query predicates
 * into a horizontal token ribbon with bulk clear action.
 *
 * @maturity stable
 */
export const FilterBar = forwardRef<HTMLDivElement, FilterBarProps>(
  ({ children, onClearAll, className = "", ...restProps }, ref) => {
    return (
      <div
        ref={ref}
        className={`${styles.filterBar} ${className}`.trim()}
        role="region"
        aria-label="Filters"
        {...restProps}
      >
        <div className={styles.filterLabel}>
          <Filter size={13} className={styles.filterIcon} aria-hidden="true" />
          <span>Filters:</span>
        </div>
        <div className={styles.filterContent}>{children}</div>
        {onClearAll && (
          <button
            type="button"
            onClick={onClearAll}
            className={styles.clearBtn}
          >
            Clear all
          </button>
        )}
      </div>
    );
  }
);

FilterBar.displayName = "FilterBar";
