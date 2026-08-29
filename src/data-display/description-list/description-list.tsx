"use client";

import { type FC, type ReactNode } from "react";
import styles from "./description-list.module.css";

export interface DescriptionItem {
  label: ReactNode;
  value: ReactNode;
}

export interface DescriptionListProps {
  items: DescriptionItem[];
  columns?: 1 | 2 | 3;
  className?: string;
}

export const DescriptionList: FC<DescriptionListProps> = ({
  items,
  columns = 1,
  className = "",
}) => {
  return (
    <dl
      className={`${styles.list} ${styles[`cols_${columns}`]} ${className}`.trim()}
    >
      {items.map((item, idx) => (
        <div key={idx} className={styles.row}>
          <dt className={styles.label}>{item.label}</dt>
          <dd className={styles.value}>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
};

export const KeyValueList = DescriptionList;
