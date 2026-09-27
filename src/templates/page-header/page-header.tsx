"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import { Breadcrumb, type BreadcrumbItem } from "../../navigation/breadcrumb";
import styles from "./page-header.module.css";

type ShellDensity = "ultra-compact" | "compact" | "standard" | "comfortable";

export const pageHeaderVariants = cva(styles.pageHeader, {
  variants: {
    density: {
      "ultra-compact": styles.density_ultra_compact,
      compact: styles.density_compact,
      standard: styles.density_standard,
      comfortable: styles.density_comfortable,
    },
  },
  defaultVariants: {
    density: "standard",
  },
});

export interface PageHeaderProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof pageHeaderVariants> {
  title: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  badge?: ReactNode;
  actions?: ReactNode;
  tabs?: ReactNode;
  density?: ShellDensity;
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
      density = "standard",
      className = "",
      ...props
    },
    ref
  ) => {
    const sub = subtitle ?? description;
    return (
      <div
        ref={ref}
        data-slot="page-header"
        data-density={density}
        className={`${pageHeaderVariants({ density })} ${tabs ? styles.withTabs : ""} ${className}`.trim()}
        {...props}
      >
        <div data-slot="page-header-top-row" className={styles.topRow}>
          <div data-slot="page-header-title-area" className={styles.titleArea}>
            {breadcrumbs && breadcrumbs.length > 0 && (
              <div data-slot="page-header-breadcrumb" className={styles.breadcrumbWrap}>
                <Breadcrumb items={breadcrumbs} />
              </div>
            )}
            <div data-slot="page-header-title-row" className={styles.titleRow}>
              <h1 data-slot="page-header-title" className={styles.title}>{title}</h1>
              {badge && <div data-slot="page-header-badge">{badge}</div>}
            </div>
            {sub && <div data-slot="page-header-subtitle" className={styles.subtitle}>{sub}</div>}
          </div>
          {actions && <div data-slot="page-header-actions" className={styles.actions}>{actions}</div>}
        </div>
        {tabs && <div data-slot="page-header-tabs" className={styles.tabsArea}>{tabs}</div>}
      </div>
    );
  }
);

PageHeader.displayName = "PageHeader";


