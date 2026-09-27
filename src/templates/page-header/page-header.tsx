"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { Breadcrumb, type BreadcrumbItem } from "../../navigation/breadcrumb";
import styles from "./page-header.module.css";

export interface PageHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  badge?: ReactNode;
  actions?: ReactNode;
  tabs?: ReactNode;
  className?: string;
}

/**
 * `<PageHeader>` provides standardized visual hierarchy at the summit of every workbench screen,
 * unifying contextual breadcrumbs, primary heading typography, status indicators, and view actions.
 *
 * @maturity stable
 */
export const PageHeader = forwardRef<HTMLDivElement, PageHeaderProps>(
  (
    {
      title,
      subtitle,
      description,
      breadcrumbs,
      badge,
      actions,
      tabs,
      className = "",
      ...props
    },
    ref
  ) => {
    const sub = subtitle ?? description;
    return (
      <div
        ref={ref}
        className={`${styles.pageHeader} ${tabs ? styles.withTabs : ""} ${className}`.trim()}
        {...props}
      >
        <div className={styles.topRow}>
          <div className={styles.titleArea}>
            {breadcrumbs && breadcrumbs.length > 0 && (
              <div className={styles.breadcrumbWrap}>
                <Breadcrumb items={breadcrumbs} />
              </div>
            )}
            <div className={styles.titleRow}>
              <h1 className={styles.title}>{title}</h1>
              {badge}
            </div>
            {sub && <div className={styles.subtitle}>{sub}</div>}
          </div>
          {actions && <div className={styles.actions}>{actions}</div>}
        </div>
        {tabs && <div className={styles.tabsArea}>{tabs}</div>}
      </div>
    );
  }
);

PageHeader.displayName = "PageHeader";

