import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import styles from "./split-master-detail-template.module.css";

export interface SplitMasterDetailTemplateProps extends HTMLAttributes<HTMLDivElement> {
  masterTitle?: string;
  masterToolbar?: ReactNode;
  masterList?: ReactNode;
  detailHeader?: ReactNode;
  detailBody?: ReactNode;
  isDetailEmpty?: boolean;
  emptyDetailMessage?: string;
}

export const SplitMasterDetailTemplate = forwardRef<HTMLDivElement, SplitMasterDetailTemplateProps>(
  (
    {
      masterTitle = "Items",
      masterToolbar,
      masterList,
      detailHeader,
      detailBody,
      isDetailEmpty = false,
      emptyDetailMessage = "Select an item from the list to view details",
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`${styles.container} ${className}`}
        role="region"
        aria-label="Master Detail Workspace"
        {...props}
      >
        <section className={styles.masterPane} aria-label="Master List Pane">
          <div className={styles.masterHeader}>
            <h2 className={styles.masterTitle}>{masterTitle}</h2>
            {masterToolbar && <div className={styles.masterToolbar}>{masterToolbar}</div>}
          </div>
          <div className={styles.masterList}>{masterList}</div>
        </section>

        <section className={styles.detailPane} aria-label="Detail Record Pane">
          {isDetailEmpty ? (
            <div className={styles.emptyState}>{emptyDetailMessage}</div>
          ) : (
            <>
              {detailHeader && <div className={styles.detailHeader}>{detailHeader}</div>}
              <div className={styles.detailBody}>{detailBody}</div>
            </>
          )}
        </section>
      </div>
    );
  }
);

SplitMasterDetailTemplate.displayName = "SplitMasterDetailTemplate";
