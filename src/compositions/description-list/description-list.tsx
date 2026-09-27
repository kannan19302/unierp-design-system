"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import styles from "./description-list.module.css";

export interface DescriptionItem {
  label: ReactNode;
  value: ReactNode;
}

export interface DescriptionListProps extends HTMLAttributes<HTMLDListElement> {
  items: DescriptionItem[];
  columns?: 1 | 2 | 3;
  className?: string;
}

/**
 * DescriptionList renders high-density key-value pairs formatted as semantic definition lists.
 *
 * @maturity stable
 */
export const DescriptionList = forwardRef<HTMLDListElement, DescriptionListProps>(({
  items,
  columns = 1,
  className = "",
  ...props
}, ref) => {
  return (
    <dl
      ref={ref}
      className={`${styles.list} ${styles[`cols_${columns}`]} ${className}`.trim()}
      {...props}
    >
      {items.map((item, idx) => (
        <div key={idx} className={styles.row}>
          <dt className={styles.label}>{item.label}</dt>
          <dd className={styles.value}>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
});

DescriptionList.displayName = "DescriptionList";

export const KeyValueList = DescriptionList;
