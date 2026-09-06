import React from "react";
import styles from "./record-anchor-navigation-strip.module.css";

export type RecordAnchorStatus = "completed" | "error" | "warning" | "pending";

export interface RecordAnchorItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  status?: RecordAnchorStatus;
  count?: number;
}

export interface RecordAnchorNavigationStripProps {
  items: RecordAnchorItem[];
  activeId?: string;
  onSelect?: (id: string) => void;
  title?: string;
  orientation?: "vertical" | "horizontal";
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
  testId?: string;
}

export const RecordAnchorNavigationStrip: React.FC<RecordAnchorNavigationStripProps> = ({
  items,
  activeId,
  onSelect,
  title = "Record Sections",
  orientation = "vertical",
  density = "standard",
  className = "",
  testId = "record-anchor-navigation-strip",
}) => {
  const renderStatusIcon = (status?: RecordAnchorStatus) => {
    switch (status) {
      case "completed":
        return <span className={`${styles.statusIcon} ${styles.statusCompleted}`} aria-label="Section complete">✓</span>;
      case "error":
        return <span className={`${styles.statusIcon} ${styles.statusError}`} aria-label="Section has errors">!</span>;
      case "warning":
        return <span className={`${styles.statusIcon} ${styles.statusWarning}`} aria-label="Section has warnings">⚠</span>;
      case "pending":
        return <span className={`${styles.statusIcon} ${styles.statusPending}`} aria-label="Section pending">○</span>;
      default:
        return null;
    }
  };

  return (
    <nav
      className={`${styles.navStrip} ${orientation === "horizontal" ? styles.horizontal : ""} ${className}`}
      data-density={density}
      data-testid={testId}
      aria-label={title}
    >
      {title && (
        <div className={styles.header}>
          <h4 className={styles.title}>{title}</h4>
        </div>
      )}

      <ul className={styles.itemList} role="list">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <li key={item.id}>
              <button
                type="button"
                className={`${styles.itemButton} ${isActive ? styles.itemButtonActive : ""}`}
                onClick={() => onSelect?.(item.id)}
                aria-current={isActive ? "true" : undefined}
                aria-label={`${item.label}${item.status ? ` - ${item.status}` : ""}`}
              >
                <div className={styles.itemLeft}>
                  {item.icon && <span aria-hidden="true">{item.icon}</span>}
                  <span className={styles.itemLabel}>{item.label}</span>
                </div>
                <div className={styles.itemRight}>
                  {typeof item.count === "number" && (
                    <span className={styles.badge}>{item.count}</span>
                  )}
                  {renderStatusIcon(item.status)}
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
