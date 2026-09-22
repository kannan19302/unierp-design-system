import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import styles from "./listing-detail-header.module.css";

export interface ListingDetailHeaderProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  publisher: string;
  category: string;
  version: string;
  lastUpdated?: string;
  rating?: number;
  installCount?: string;
  icon?: ReactNode;
  actions?: ReactNode;
}

export const ListingDetailHeader = forwardRef<HTMLDivElement, ListingDetailHeaderProps>(
  (
    {
      name,
      publisher,
      category,
      version,
      lastUpdated = "Sep 2026",
      rating = 4.9,
      installCount = "12,400+ installs",
      icon,
      actions,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`${styles.header} ${className}`}
        role="region"
        aria-label={`Marketplace listing: ${name}`}
        {...props}
      >
        <div className={styles.main}>
          <div className={styles.iconContainer}>
            {icon || <span className={styles.icon}>🔌</span>}
          </div>

          <div className={styles.details}>
            <div className={styles.tagRow}>
              <span className={styles.categoryBadge}>{category}</span>
              <span className={styles.versionBadge}>v{version}</span>
            </div>

            <h1 className={styles.name}>{name}</h1>
            <p className={styles.publisher}>by {publisher}</p>

            <div className={styles.metaRow}>
              <span className={styles.rating}>★ {rating.toFixed(1)}</span>
              <span className={styles.dot}>•</span>
              <span className={styles.installs}>{installCount}</span>
              <span className={styles.dot}>•</span>
              <span className={styles.updated}>Updated {lastUpdated}</span>
            </div>
          </div>
        </div>

        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
    );
  }
);

ListingDetailHeader.displayName = "ListingDetailHeader";
