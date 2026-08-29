"use client";

import React, { useState, useCallback } from "react";
import styles from "./drill-down-modal.module.css";

export interface DrillDownColumn {
  key: string;
  label: string;
  render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
}

export interface DrillDownModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: React.ReactNode;
  columns: DrillDownColumn[];
  rows: Record<string, unknown>[];
  loading?: boolean;
  onExport?: () => void;
}

export const DrillDownModal: React.FC<DrillDownModalProps> = ({
  isOpen,
  onClose,
  title,
  icon,
  columns,
  rows,
  loading = false,
  onExport,
}) => {
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
        }),
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
        .join(","),
    );
    const csv = [header, ...csvRows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "_").toLowerCase()}_export.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, [onExport, columns, filteredRows, title]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby="drilldown-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={styles.modalCard}
      >
        {/* Header */}
        <div className={styles.header}>
          <h2 id="drilldown-title" className={styles.title}>
            {icon && (
              <span style={{ color: "var(--color-brand, #3b82f6)" }}>{icon}</span>
            )}
            {title} — Source Records
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            <button
              type="button"
              onClick={handleExport}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-1)",
                padding: "var(--space-1) var(--space-3)",
                border: "1px solid var(--color-border-default, #e2e8f0)",
                borderRadius: "var(--radius-md)",
                background: "var(--color-surface-subtle)",
                color: "var(--color-text-secondary)",
                fontSize: "var(--text-xs)",
                cursor: "pointer",
              }}
            >
              ↓ Export CSV
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--color-text-secondary)",
                fontSize: "var(--text-lg)",
                padding: "var(--space-1)",
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div className={styles.searchWrap}>
          <input
            type="search"
            placeholder="Search records..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              maxWidth: "320px",
              padding: "var(--space-2) var(--space-3)",
              border: "1px solid var(--color-border-default, #e2e8f0)",
              borderRadius: "var(--radius-md)",
              fontSize: "var(--text-sm)",
            }}
          />
        </div>

        {/* Body */}
        <div className={styles.body}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "var(--space-12)", color: "var(--color-text-secondary)" }}>
              Loading records…
            </div>
          ) : filteredRows.length === 0 ? (
            <div style={{ textAlign: "center", padding: "var(--space-12)", color: "var(--color-text-secondary)" }}>
              {searchQuery ? "No matching records found." : "No records available."}
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th key={col.key} className={styles.th}>
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row, i) => (
                  <tr key={i}>
                    {columns.map((col) => (
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
            {filteredRows.length} record{filteredRows.length !== 1 ? "s" : ""} found
          </span>
          <button
            type="button"
            onClick={onClose}
            style={{
              fontSize: "var(--text-xs)",
              padding: "var(--space-1) var(--space-4)",
              border: "1px solid var(--color-border-default, #e2e8f0)",
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
};
