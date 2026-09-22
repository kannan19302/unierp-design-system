import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import styles from "./extension-card.module.css";

export interface ExtensionCardProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  publisher: string;
  version?: string;
  description?: string;
  rating?: number;
  reviewCount?: number;
  isVerified?: boolean;
  isInstalled?: boolean;
  icon?: ReactNode;
  onInstall?: () => void;
  onManage?: () => void;
}

export const ExtensionCard = forwardRef<HTMLDivElement, ExtensionCardProps>(
  (
    {
      name,
      publisher,
      version = "1.0.0",
      description = "Extends core ERP capabilities with third-party connectors.",
      rating = 4.8,
      reviewCount = 42,
      isVerified = true,
      isInstalled = false,
      icon,
      onInstall,
      onManage,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`${styles.card} ${className}`}
        role="article"
        aria-label={`Marketplace extension: ${name}`}
        {...props}
      >
        <div className={styles.header}>
          <div className={styles.iconArea}>
            {icon || <span className={styles.defaultIcon}>📦</span>}
          </div>
          <div className={styles.info}>
            <div className={styles.titleRow}>
              <h3 className={styles.name}>{name}</h3>
              {isVerified && <span className={styles.verifiedBadge}>✓ Verified</span>}
            </div>
            <div className={styles.metaRow}>
              <span className={styles.publisher}>{publisher}</span>
              <span className={styles.dot}>•</span>
              <span className={styles.version}>v{version}</span>
            </div>
          </div>
        </div>

        <p className={styles.description}>{description}</p>

        <div className={styles.footer}>
          <div className={styles.ratingArea}>
            <span className={styles.star}>★</span>
            <span className={styles.ratingVal}>{rating.toFixed(1)}</span>
            <span className={styles.reviewCount}>({reviewCount})</span>
          </div>

          <div className={styles.actions}>
            {isInstalled ? (
              <button
                type="button"
                className={styles.manageBtn}
                onClick={onManage}
              >
                Manage
              </button>
            ) : (
              <button
                type="button"
                className={styles.installBtn}
                onClick={onInstall}
              >
                Install Extension
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
);

ExtensionCard.displayName = "ExtensionCard";
