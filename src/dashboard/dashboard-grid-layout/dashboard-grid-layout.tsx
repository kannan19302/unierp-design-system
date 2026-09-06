"use client";

import React from "react";
import styles from "./dashboard-grid-layout.module.css";

export interface DashboardGridLayoutProps { children: React.ReactNode; columns?: number; gap?: number; }

export const DashboardGridLayout: React.FC<DashboardGridLayoutProps> = (props) => {
  const { children, columns = 3, gap = 16 } = props;
  return (
    <div className={styles.container} role="region" aria-label="Dashboard grid" style={{ padding: 0 }}>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap, padding: 'var(--space-4)' }}>
        {children}
      </div>
    </div>
  );
};
