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
  className = "",
}) => {
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

          <main className={styles.detailsPane} id="unierp-main" aria-label="Workspace Details">
            {detailWorkspace}
          </main>
        </div>
      </div>
    </div>
  );
};
