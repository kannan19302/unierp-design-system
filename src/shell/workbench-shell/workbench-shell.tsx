"use client";

import { type FC, type ReactNode } from "react";
import styles from "./workbench-shell.module.css";

export interface WorkbenchShellProps {
  /** Optional global bar pinned at the top */
  topBar?: ReactNode;

  /** Pane 1: Category, folder, or hierarchy classification tree */
  classificationTree: ReactNode;

  /** Pane 2: Working record list / queue with search and filters */
  recordList: ReactNode;

  /** Pane 3: Selected record details, forms, tabs, and actions */
  detailWorkspace: ReactNode;

  /**
   * Landmark tag for the details pane. Defaults to 'main' for standalone use,
   * or 'section' when nested inside an outer shell that already renders <main>.
   */
  detailsAs?: "main" | "section" | "div";

  /** Custom ID for the details pane. Set to null to omit id. Defaults to 'unierp-main'. */
  detailsId?: string | null;

  /** Set to true when WorkbenchShell is nested inside an outer shell like PlatformShell */
  nested?: boolean;

  className?: string;
}

/**
 * `<WorkbenchShell>` — Three-Pane Workbench layout for DL 2.0.
 *
 * Anatomy: `[Classification Hierarchy] → [Record List] → [Object Details Workspace]`
 *
 * Designed for high-frequency operational domains (e.g. Master Data Management,
 * Inventory Cataloging, Customer Support Queues, Asset Classification).
 */
export const WorkbenchShell: FC<WorkbenchShellProps> = ({
  topBar,
  classificationTree,
  recordList,
  detailWorkspace,
  detailsAs,
  detailsId,
  nested = false,
  className = "",
}) => {
  const Tag = detailsAs ?? (nested ? "section" : "main");
  const resolvedId = detailsId !== undefined ? (detailsId ?? undefined) : (nested ? undefined : "unierp-main");

  return (
    <div className={`${styles.root} ${className}`.trim()}>
      <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%" }}>
        {topBar && <div className={styles.topBar}>{topBar}</div>}

        <div className={styles.workbenchContainer}>
          <aside className={styles.classificationPane} aria-label="Classification">
            {classificationTree}
          </aside>

          <section className={styles.recordListPane} aria-label="Record List">
            {recordList}
          </section>

          <Tag className={styles.detailsPane} id={resolvedId} aria-label="Workspace Details">
            {detailWorkspace}
          </Tag>
        </div>
      </div>
    </div>
  );
};
