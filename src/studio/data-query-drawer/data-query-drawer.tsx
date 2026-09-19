"use client";

import {
  forwardRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import styles from "./data-query-drawer.module.css";

export interface QueryExecutionResult {
  columns: string[];
  rows: Record<string, any>[];
  totalCount?: number;
}

export interface DataQueryDrawerProps {
  /** Query name / identifier e.g. "getSuppliersList" */
  queryName: string;
  /** Data source type / dialect badge */
  sourceType?: string;
  /** Whether the drawer is currently expanded */
  isOpen: boolean;
  /** Callback to toggle drawer open / collapsed state */
  onToggleOpen: () => void;
  /** Callback to re-run the query */
  onRunQuery?: () => void;
  /** Execution status metadata */
  status?: {
    code: number;
    latencyMs: number;
  };
  /** Raw SQL / GraphQL / JSON query code */
  queryText: string;
  /** Callback when query code is edited */
  onChangeQueryText?: (text: string) => void;
  /** Preview test data table result */
  results?: QueryExecutionResult;
  /** Optional custom action button */
  actions?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export type QueryDrawerTab = "editor" | "results" | "schema";

/**
 * `<DataQueryDrawer>` — Bottom query inspection drawer with code editor and tabular result grid.
 *
 * @maturity stable
 */
export const DataQueryDrawer = forwardRef<HTMLDivElement, DataQueryDrawerProps>(
  (
    {
      queryName,
      sourceType = "PostgreSQL",
      isOpen,
      onToggleOpen,
      onRunQuery,
      status = { code: 200, latencyMs: 38 },
      queryText,
      onChangeQueryText,
      results,
      actions,
      className,
      style,
    },
    ref,
  ) => {
    const [activeTab, setActiveTab] = useState<QueryDrawerTab>("results");

    const drawerClasses = [
      styles.drawer,
      isOpen ? styles.open : styles.collapsed,
      className ?? "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        ref={ref}
        className={drawerClasses}
        style={style}
        role="region"
        aria-label={`Data Query Drawer: ${queryName}`}
      >
        <div className={styles.headerBar}>
          <div className={styles.headerLead}>
            <button
              type="button"
              className={styles.toggleBtn}
              onClick={onToggleOpen}
              aria-expanded={isOpen}
              aria-label={isOpen ? "Collapse query drawer" : "Expand query drawer"}
            >
              <span className={styles.chevron} aria-hidden="true">
                {isOpen ? "▾" : "▴"}
              </span>
              <span className={styles.queryTitle}>{queryName}</span>
            </button>
            <span className={styles.sourceBadge}>{sourceType}</span>
            {status && (
              <span className={`${styles.statusBadge} ${status.code >= 200 && status.code < 300 ? styles.ok : styles.err}`}>
                <span className={styles.dot} aria-hidden="true" />
                {status.code} OK • {status.latencyMs}ms
              </span>
            )}
            {results && (
              <span className={styles.recordCount}>
                {results.rows.length} records returned
              </span>
            )}
          </div>

          <div className={styles.headerActions}>
            {isOpen && (
              <div className={styles.tabGroup} role="tablist" aria-label="Query Views">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "results"}
                  className={`${styles.tabBtn} ${activeTab === "results" ? styles.tabActive : ""}`}
                  onClick={() => setActiveTab("results")}
                >
                  Results Preview
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "editor"}
                  className={`${styles.tabBtn} ${activeTab === "editor" ? styles.tabActive : ""}`}
                  onClick={() => setActiveTab("editor")}
                >
                  Query SQL
                </button>
              </div>
            )}

            {onRunQuery && (
              <button
                type="button"
                className={styles.runBtn}
                onClick={onRunQuery}
                aria-label="Execute query"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                <span>Run Query</span>
              </button>
            )}
            {actions}
          </div>
        </div>

        {isOpen && (
          <div className={styles.contentBody}>
            {activeTab === "editor" && (
              <div className={styles.editorPane}>
                <textarea
                  className={styles.queryTextArea}
                  value={queryText}
                  onChange={(e) => onChangeQueryText?.(e.target.value)}
                  aria-label="Query Code Editor"
                  rows={6}
                />
              </div>
            )}

            {activeTab === "results" && (
              <div className={styles.resultsPane}>
                {results && results.rows.length > 0 ? (
                  <div className={styles.tableWrapper}>
                    <table className={styles.resultsTable}>
                      <thead>
                        <tr>
                          {results.columns.map((col) => (
                            <th key={col} className={styles.thCell}>
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {results.rows.map((row, idx) => (
                          <tr key={idx} className={styles.trRow}>
                            {results.columns.map((col) => (
                              <td key={col} className={styles.tdCell}>
                                {row[col] !== undefined ? String(row[col]) : "null"}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className={styles.emptyState}>
                    <p>No records returned. Execute query to fetch results.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
);

DataQueryDrawer.displayName = "DataQueryDrawer";
