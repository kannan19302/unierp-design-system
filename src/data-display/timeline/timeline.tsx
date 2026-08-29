"use client";

import { type FC, type ReactNode } from "react";
import styles from "./timeline.module.css";

export interface TimelineItem {
  id: string;
  title: ReactNode;
  timestamp: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  status?: "complete" | "current" | "pending" | "danger";
}

export interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export const Timeline: FC<TimelineProps> = ({ items, className = "" }) => {
  return (
    <div className={`${styles.container} ${className}`.trim()} role="list">
      {items.map((item, idx) => {
        const status = item.status || (idx === 0 ? "complete" : "pending");
        return (
          <div key={item.id} className={styles.item} role="listitem">
            <div className={`${styles.node} ${styles[status]}`}>
              {item.icon ? (
                <span className={styles.icon}>{item.icon}</span>
              ) : (
                <span className={styles.dot} />
              )}
            </div>
            {idx < items.length - 1 && <div className={styles.line} aria-hidden="true" />}

            <div className={styles.content}>
              <div className={styles.header}>
                <span className={styles.title}>{item.title}</span>
                <span className={styles.timestamp}>{item.timestamp}</span>
              </div>
              {item.description && (
                <div className={styles.description}>{item.description}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
