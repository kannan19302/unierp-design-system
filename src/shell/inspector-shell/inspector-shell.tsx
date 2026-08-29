"use client";

import { type FC, type ReactNode } from "react";
import styles from "./inspector-shell.module.css";

export interface InspectorShellProps {
  /** Optional navigation rail on the left */
  navigation?: ReactNode;
  navigationCollapsed?: boolean;

  /** Header bar or filter toolbar */
  topBar?: ReactNode;

  /** The primary working list or data table */
  list: ReactNode;

  /** Right-hand contextual inspector panel */
  inspector?: ReactNode;
  inspectorOpen?: boolean;
  onToggleInspector?: () => void;

  className?: string;
}

/**
 * `<InspectorShell>` — List + Inspector workspace pattern for DL 2.0.
 *
 * Layout: `[Navigation Rail] | [Working List] | [Context Inspector]`
 *
 * Keeps users centered on their working list while inspecting item details,
 * comments, activity, attachments, or quick edit fields without navigating away.
 */
export const InspectorShell: FC<InspectorShellProps> = ({
  navigation,
  navigationCollapsed = false,
  topBar,
  list,
  inspector,
  inspectorOpen = true,
  className = "",
}) => {
  return (
    <div className={`${styles.root} ${className}`.trim()}>
      {navigation && (
        <aside
          className={`${styles.navRail} ${
            navigationCollapsed ? styles.navRailCollapsed : ""
          }`.trim()}
          aria-label="Navigation"
        >
          {navigation}
        </aside>
      )}

      <div className={styles.mainArea}>
        {topBar && <div className={styles.topBar}>{topBar}</div>}

        <div className={styles.workingArea}>
          <main className={styles.listColumn} id="unierp-main">
            {list}
          </main>

          {inspector && (
            <aside
              className={`${styles.inspectorColumn} ${
                !inspectorOpen ? styles.inspectorCollapsed : ""
              }`.trim()}
              aria-label="Context Inspector"
              aria-hidden={!inspectorOpen}
            >
              {inspectorOpen && inspector}
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};
