import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import styles from "./split-detail-page.module.css";

export const splitMasterDetailVariants = cva(styles.container, {
  variants: {
    density: {
      "ultra-compact": styles.densityUltraCompact,
      compact: styles.densityCompact,
      standard: styles.densityStandard,
      comfortable: styles.densityComfortable,
    },
  },
  defaultVariants: {
    density: "standard",
  },
});

export interface SplitMasterDetailTemplateProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof splitMasterDetailVariants> {
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
      density = "standard",
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`${splitMasterDetailVariants({ density })} ${className}`}
        data-slot="split-detail-page"
        data-density={density}
        role="region"
        aria-label="Master Detail Workspace"
        {...props}
      >
        <section
          className={styles.masterPane}
          data-slot="split-detail-page-master-pane"
          aria-label="Master List Pane"
        >
          <div className={styles.masterHeader} data-slot="split-detail-page-master-header">
            <h2 className={styles.masterTitle} data-slot="split-detail-page-master-title">
              {masterTitle}
            </h2>
            {masterToolbar && (
              <div className={styles.masterToolbar} data-slot="split-detail-page-master-toolbar">
                {masterToolbar}
              </div>
            )}
          </div>
          <div className={styles.masterList} data-slot="split-detail-page-master-list">
            {masterList}
          </div>
        </section>

        <section
          className={styles.detailPane}
          data-slot="split-detail-page-detail-pane"
          aria-label="Detail Record Pane"
        >
          {isDetailEmpty ? (
            <div className={styles.emptyState} data-slot="split-detail-page-empty-state">
              {emptyDetailMessage}
            </div>
          ) : (
            <>
              {detailHeader && (
                <div className={styles.detailHeader} data-slot="split-detail-page-detail-header">
                  {detailHeader}
                </div>
              )}
              <div className={styles.detailBody} data-slot="split-detail-page-detail-body">
                {detailBody}
              </div>
            </>
          )}
        </section>
      </div>
    );
  }
);

SplitMasterDetailTemplate.displayName = "SplitMasterDetailTemplate";

export const SplitDetailPageTemplate = SplitMasterDetailTemplate;
