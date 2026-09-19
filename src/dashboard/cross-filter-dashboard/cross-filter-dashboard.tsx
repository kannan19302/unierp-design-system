"use client";

import React, { forwardRef, useState } from "react";
import styles from "./cross-filter-dashboard.module.css";

export interface DashboardFilter {
  id: string;
  label: string;
  options: string[];
  defaultValue?: string;
}

export interface CrossFilterDashboardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  filters: DashboardFilter[];
  onFilterChange?: (filters: Record<string, string>) => void;
  children?: React.ReactNode;
}

/**
 * CrossFilterDashboard
 *
 * Coordinated multi-dimensional analytical dashboard shell with cross-filtering
 * dimension controls synchronizing child report widgets and data views.
 *
 * @maturity stable
 */
export const CrossFilterDashboard = forwardRef<
  HTMLDivElement,
  CrossFilterDashboardProps
>(function CrossFilterDashboard(
  { filters, onFilterChange, children, className, ...restProps },
  ref
) {
  const [active, setActive] = useState<Record<string, string>>({});

  const handleChange = (id: string, val: string) => {
    const next = { ...active, [id]: val };
    setActive(next);
    onFilterChange?.(next);
  };

  const containerClasses = [styles.container, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={ref}
      className={containerClasses}
      role="region"
      aria-label="Cross-filter dashboard"
      {...restProps}
    >
      <div className={styles.filterBar}>
        {filters.map((f) => (
          <select
            key={f.id}
            className={styles.select}
            value={active[f.id] || f.defaultValue || ""}
            onChange={(e) => handleChange(f.id, e.target.value)}
            aria-label={f.label}
          >
            <option value="">All {f.label}s</option>
            {f.options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        ))}
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
});

CrossFilterDashboard.displayName = "CrossFilterDashboard";
