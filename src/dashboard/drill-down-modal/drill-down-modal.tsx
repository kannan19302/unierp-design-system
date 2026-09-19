"use client";

import React, { forwardRef, useState, useCallback } from "react";
import styles from "./drill-down-modal.module.css";

export interface DrillDownColumn {
  key: string;
  label: string;
  render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
}

export interface DrillDownModalProps
  extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: React.ReactNode;
  columns: DrillDownColumn[];
  rows: Record<string, unknown>[];
  loading?: boolean;
  onExport?: () => void;
}

/**
 * DrillDownModal
 *
 * Granular inspection dialog surfacing underlying line-item ledger records,
 * transaction rows, and audit events corresponding to an aggregated metric or chart slice.
 *
 * @maturity stable
 */
export const DrillDownModal = forwardRef<HTMLDivElement, DrillDownModalProps>(
  function DrillDownModal(
    {
      isOpen,
      onClose,
      title,
      icon,
      columns,
      rows,
      loading = false,
      onExport,
      className,
      ...restProps
    },
    ref
  ) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredRows = searchQuery
      ? rows.filter((row: Record<string, unknown>) =>
          columns.some((col: DrillDownColumn) => {
            const val = row[col.key];
            return (
              val !== null &&
              val !== undefined &&
              String(val).toLowerCase().includes(searchQuery.toLowerCase())
            );
          })
        )
      : rows;

    const handleExport = useCallback(() => {
      if (onExport) {
        onExport();
        return;
      }
      // Default CSV export
      const header = columns.map((c: DrillDownColumn) => c.label).join(",");
      const csvRows = filteredRows.map((row: Record<string, unknown>) =>
        columns
          .map((c: DrillDownColumn) => `"${String(row[c.key] ?? "")}"`)
          .join(",")
      );
      const csv = [header, ...csvRows].join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title.replace(/\s+/g, "_")}_drilldown.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }, [columns, filteredRows, onExport, title]);

    if (!isOpen) return null;

    const containerClasses = [styles.backdrop, className]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        ref={ref}
        className={containerClasses}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drilldown-title"
        {...restProps}
      >
        <div className={styles.modalCard}>
          {/* Header */}
          <div className={styles.header}>
            <h3 id="drilldown-title" className={styles.title}>
              {icon}
              <span>{title} — Source Records</span>
            </h3>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
              }}
            >
              <button
                type="button"
                onClick={handleExport}
                style={{
                  fontSize: "var(--text-xs)",
                  padding: "var(--space-1) var(--space-3)",
                  border: "1px solid var(--color-border-default)",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--color-surface-elevated)",
                  cursor: "pointer",
                }}
              >
                Export CSV
              </button>
              <button
                type="button"
                onClick={onClose}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "var(--text-base)",
                  cursor: "pointer",
                  color: "var(--color-text-secondary)",
                }}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className={styles.searchWrap}>
            <input
              type="text"
              placeholder="Search records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "var(--space-2) var(--space-3)",
                border: "1px solid var(--color-border-default)",
                borderRadius: "var(--radius-sm)",
                fontSize: "var(--text-xs)",
                background: "var(--color-surface-elevated)",
                color: "var(--color-text-primary)",
              }}
              aria-label="Search records"
            />
          </div>

          {/* Body: Table */}
          <div className={styles.body}>
            {loading ? (
              <div
                style={{
                  padding: "var(--space-8)",
                  textAlign: "center",
                  color: "var(--color-text-secondary)",
                  fontSize: "var(--text-sm)",
                }}
              >
                Loading underlying records...
              </div>
            ) : filteredRows.length === 0 ? (
              <div
                style={{
                  padding: "var(--space-8)",
                  textAlign: "center",
                  color: "var(--color-text-tertiary)",
                  fontSize: "var(--text-sm)",
                }}
              >
                No matching records found.
              </div>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    {columns.map((col: DrillDownColumn) => (
                      <th key={col.key} className={styles.th}>
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((row: Record<string, unknown>, idx: number) => (
                    <tr key={idx}>
                      {columns.map((col: DrillDownColumn) => (
                        <td key={col.key} className={styles.td}>
                          {col.render
                            ? col.render(row[col.key], row)
                            : String(row[col.key] ?? "—")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Footer */}
          <div className={styles.footer}>
            <span>
              {filteredRows.length} record
              {filteredRows.length !== 1 ? "s" : ""} found
            </span>
            <button
              type="button"
              onClick={onClose}
              style={{
                fontSize: "var(--text-xs)",
                padding: "var(--space-1) var(--space-4)",
                border: "1px solid var(--color-border-default)",
                borderRadius: "var(--radius-sm)",
                background: "var(--color-surface-subtle)",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }
);

DrillDownModal.displayName = "DrillDownModal";
