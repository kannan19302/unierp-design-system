"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { X } from "lucide-react";
import styles from "./filter-chip-group.module.css";

export interface FilterChip {
  id: string;
  field: string;
  label: string;
  value: string;
  removable?: boolean;
}

export interface FilterChipGroupProps extends HTMLAttributes<HTMLDivElement> {
  chips?: FilterChip[];
  onRemoveChip?: (id: string) => void;
  onClearAll?: () => void;
  prefixLabel?: string;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
}

export const FilterChipGroup = forwardRef<HTMLDivElement, FilterChipGroupProps>(
  (
    {
      chips = [
        { id: "c1", field: "Status", label: "Active", value: "active", removable: true },
        { id: "c2", field: "Owner", label: "Acme Operations", value: "acme", removable: true },
      ],
      onRemoveChip,
      onClearAll,
      prefixLabel = "Active Filters:",
      density,
      className = "",
      ...props
    },
    ref
  ) => {
    if (!chips.length) return null;

    return (
      <div
        ref={ref}
        data-density={density}
        className={`${styles.container} ${density ? styles[density] : ""} ${className}`.trim()}
        role="group"
        aria-label="Active filters"
        {...props}
      >
        {prefixLabel && <span className={styles.prefixLabel}>{prefixLabel}</span>}
        <div className={styles.chipList}>
          {chips.map((chip) => (
            <span key={chip.id} className={styles.chip} data-testid={`filter-chip-${chip.id}`}>
              <span className={styles.chipField}>{chip.field}:</span>
              <span className={styles.chipValue}>{chip.label}</span>
              {chip.removable !== false && (
                <button
                  type="button"
                  className={styles.removeBtn}
                  aria-label={`Remove filter for ${chip.field}: ${chip.label}`}
                  onClick={() => onRemoveChip?.(chip.id)}
                >
                  <X size={10} aria-hidden="true" />
                </button>
              )}
            </span>
          ))}
        </div>
        {onClearAll && (
          <button
            type="button"
            className={styles.clearAllBtn}
            onClick={onClearAll}
          >
            Clear All
          </button>
        )}
      </div>
    );
  }
);

FilterChipGroup.displayName = "FilterChipGroup";
