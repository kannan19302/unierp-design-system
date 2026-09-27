"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import styles from "./timeline.module.css";

export type TimelineDensity = "ultra-compact" | "compact" | "standard" | "comfortable";

export const timelineVariants = cva(styles.container, {
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

export interface TimelineItem {
  id: string;
  title: ReactNode;
  timestamp: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  status?: "complete" | "current" | "pending" | "danger";
}

export interface TimelineProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children">,
    VariantProps<typeof timelineVariants> {
  items: TimelineItem[];
  density?: TimelineDensity;
}

/**
 * Timeline renders a vertical sequence of chronological events, audit trails, and status progressions.
 *
 * @maturity stable
 */
export const Timeline = forwardRef<HTMLDivElement, TimelineProps>(
  function Timeline({ items, density = "standard", className = "", ...props }, ref) {
    return (
      <div
        ref={ref}
        className={`${timelineVariants({ density })} ${className}`.trim()}
        role="list"
        data-slot="timeline"
        data-density={density}
        {...props}
      >
        {items.map((item, idx) => {
          const status = item.status || (idx === 0 ? "complete" : "pending");
          return (
            <div key={item.id} className={styles.item} role="listitem" data-slot="timeline-item">
              <div className={`${styles.node} ${styles[status]}`} data-slot="timeline-node">
                {item.icon ? (
                  <span className={styles.icon} data-slot="timeline-icon">{item.icon}</span>
                ) : (
                  <span className={styles.dot} data-slot="timeline-dot" />
                )}
              </div>
              {idx < items.length - 1 && <div className={styles.line} aria-hidden="true" data-slot="timeline-line" />}

              <div className={styles.content} data-slot="timeline-content">
                <div className={styles.header} data-slot="timeline-header">
                  <span className={styles.title} data-slot="timeline-title">{item.title}</span>
                  <span className={styles.timestamp} data-slot="timeline-timestamp">{item.timestamp}</span>
                </div>
                {item.description && (
                  <div className={styles.description} data-slot="timeline-description">{item.description}</div>
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

