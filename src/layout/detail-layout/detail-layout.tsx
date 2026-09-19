"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import styles from "./detail-layout.module.css";

export interface DetailLayoutProps extends HTMLAttributes<HTMLDivElement> {
  header: ReactNode;
  main: ReactNode;
  sidebar?: ReactNode;
  className?: string;
}

/**
 * DetailLayout provides a structural foundation for entity detail views,
 * orchestrating top-level headers, primary content, and contextual metadata sidebars.
 *
 * @maturity stable
 */
export const DetailLayout = forwardRef<HTMLDivElement, DetailLayoutProps>(
  ({ header, main, sidebar, className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`${styles.layout} ${className}`.trim()}
        {...props}
      >
        <header className={styles.header}>{header}</header>
        <div className={styles.body}>
          <main className={styles.main}>{main}</main>
          {sidebar && <aside className={styles.sidebar}>{sidebar}</aside>}
        </div>
      </div>
    );
  }
);

DetailLayout.displayName = "DetailLayout";

