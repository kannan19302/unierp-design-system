"use client";

import { forwardRef, type ReactNode } from "react";
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

/**
 * Timeline renders a vertical sequence of chronological events, audit trails, and status progressions.
 *
 * @maturity stable
 */
export const Timeline = forwardRef<HTMLDivElement, TimelineProps>(
  function Timeline({ items, className = "" }, ref) {
    return (
      <div ref={ref} className={`${styles.container} ${className}`.trim()} role="list">
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
  }
);

Timeline.displayName = "Timeline";

