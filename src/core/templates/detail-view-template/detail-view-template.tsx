import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import styles from "./detail-view-template.module.css";

export interface DetailViewTemplateProps extends HTMLAttributes<HTMLDivElement> {
  entityType: string;
  title: string;
  identifier: string;
  statusBadge?: ReactNode;
  headerActions?: ReactNode;
  statsBar?: ReactNode;
  mainContent?: ReactNode;
  sidebarContent?: ReactNode;
}

export const DetailViewTemplate = forwardRef<HTMLDivElement, DetailViewTemplateProps>(
  (
    {
      entityType,
      title,
      identifier,
      statusBadge,
      headerActions,
      statsBar,
      mainContent,
      sidebarContent,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`${styles.page} ${className}`}
        role="main"
        aria-label={`${entityType} detail: ${title}`}
        {...props}
      >
        <div className={styles.header}>
          <div className={styles.identity}>
            <div className={styles.breadcrumb}>
              <span className={styles.typeLabel}>{entityType}</span>
              <span className={styles.separator}>/</span>
              <span className={styles.identifier}>{identifier}</span>
            </div>
            <div className={styles.titleRow}>
              <h1 className={styles.title}>{title}</h1>
              {statusBadge && <div className={styles.badgeWrapper}>{statusBadge}</div>}
            </div>
          </div>

          {headerActions && <div className={styles.actions}>{headerActions}</div>}
        </div>

        {statsBar && <div className={styles.statsBar}>{statsBar}</div>}

        <div className={styles.layout}>
          <section className={styles.main}>{mainContent}</section>
          {sidebarContent && <aside className={styles.sidebar}>{sidebarContent}</aside>}
        </div>
      </div>
    );
  }
);

DetailViewTemplate.displayName = "DetailViewTemplate";
