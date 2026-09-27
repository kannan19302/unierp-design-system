"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import styles from "./description-list.module.css";

export const descriptionListVariants = cva(styles.list, {
  variants: {
    density: {
      "ultra-compact": styles.densityUltraCompact,
      compact: styles.densityCompact,
      standard: styles.densityStandard,
      comfortable: styles.densityComfortable,
    },
    columns: {
      1: styles.cols_1,
      2: styles.cols_2,
      3: styles.cols_3,
    },
  },
  defaultVariants: {
    density: "standard",
    columns: 1,
  },
});

export type DescriptionListVariantProps = VariantProps<typeof descriptionListVariants>;

export interface DescriptionItem {
  label: ReactNode;
  value: ReactNode;
}

export interface DescriptionListProps
  extends HTMLAttributes<HTMLDListElement>,
    DescriptionListVariantProps {
  items: DescriptionItem[];
  columns?: 1 | 2 | 3;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

/**
 * DescriptionList renders high-density key-value pairs formatted as semantic definition lists.
 * Follows Strata enterprise standards with cva, 4-tier density scaling, and data-slot annotations.
 *
 * @maturity stable
 */
export const DescriptionList = forwardRef<HTMLDListElement, DescriptionListProps>(({
  items,
  columns = 1,
  density = "standard",
  className = "",
  ...props
}, ref) => {
  return (
    <dl
      ref={ref}
      data-slot="description-list"
      data-density={density}
      data-columns={columns}
      className={`${descriptionListVariants({ density, columns })}${className ? ` ${className}` : ""}`.trim()}
      {...props}
    >
      {items.map((item, idx) => (
        <div key={idx} className={styles.row} data-slot="description-list-row">
          <dt className={styles.label} data-slot="description-list-label">{item.label}</dt>
          <dd className={styles.value} data-slot="description-list-value">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
});

DescriptionList.displayName = "DescriptionList";

export const KeyValueList = DescriptionList;
export const keyValueListVariants = descriptionListVariants;
