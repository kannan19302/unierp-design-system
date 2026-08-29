"use client";

import { type FC, type ReactNode } from "react";
import { Breadcrumb, type BreadcrumbItem } from "../../navigation/breadcrumb";
import styles from "./page-header.module.css";

export interface PageHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
  tabs?: ReactNode;
  className?: string;
}

export const PageHeader: FC<PageHeaderProps> = ({
  title,
  subtitle,
  description,
  breadcrumbs,
  actions,
  tabs,
  className = "",
}) => {
  const sub = subtitle ?? description;
  return (
    <div
      className={`${styles.pageHeader} ${tabs ? styles.withTabs : ""} ${className}`.trim()}
    >
      <div className={styles.topRow}>
        <div className={styles.titleArea}>
          {breadcrumbs && breadcrumbs.length > 0 && (
            <div className={styles.breadcrumbWrap}>
              <Breadcrumb items={breadcrumbs} />
            </div>
          )}
          <h1 className={styles.title}>{title}</h1>
          {sub && <div className={styles.subtitle}>{sub}</div>}
        </div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
      {tabs && <div className={styles.tabsArea}>{tabs}</div>}
    </div>
  );
};
