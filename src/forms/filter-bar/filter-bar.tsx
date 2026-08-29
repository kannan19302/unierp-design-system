"use client";

import { type FC, type ReactNode } from "react";
import { Filter, X } from "lucide-react";
import styles from "./filter-bar.module.css";

export interface FilterTagProps {
  label: string;
  value: string;
  onRemove?: () => void;
}

export const FilterTag: FC<FilterTagProps> = ({ label, value, onRemove }) => (
  <span className={styles.tag}>
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
);

export interface FilterBarProps {
  children: ReactNode;
  onClearAll?: () => void;
  className?: string;
}

export const FilterBar: FC<FilterBarProps> = ({
  children,
  onClearAll,
  className = "",
}) => {
  return (
    <div className={`${styles.filterBar} ${className}`.trim()} role="region" aria-label="Filters">
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
};
