"use client";

import { useState, type ReactNode, type ChangeEvent } from "react";
import { MeridianBar, type MeridianSegment, type MeridianAction, type MeridianState } from "../meridian-bar";
import { PageHeader } from "../../layout/page-header";
import styles from "./data-workspace.module.css";

export interface DataWorkspaceColumn<T = Record<string, unknown>> {
  key: string;
  header: string;
  render?: (value: unknown, row: T) => ReactNode;
  width?: string;
  align?: "left" | "center" | "right";
  sortable?: boolean;
}

export interface DataWorkspaceFilter {
  key: string;
  label: string;
  options: Array<{ label: string; value: string }>;
}

export interface DataWorkspacePagination {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export interface DataWorkspaceProps<T = Record<string, unknown>> {
  /** Meridian context address segments (e.g. ['finance', 'general-ledger', 'journals']) */
  segments?: MeridianSegment[];
  /** Meridian status pill */
  state?: { label: string; tone?: MeridianState };
  /** Primary next verb at the context boundary */
  action?: MeridianAction;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  columns: DataWorkspaceColumn<T>[];
  data: T[];
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  filters?: DataWorkspaceFilter[];
  pagination?: DataWorkspacePagination;
  onRowClick?: (row: T) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  /** Bulk action slot shown when rows are selected */
  bulkActions?: ReactNode;
  selectedCount?: number;
  /** Extra slot above the grid (e.g. KPI summary, view switcher) */
  above?: ReactNode;
  className?: string;
}

export function DataWorkspace<T = Record<string, unknown>>({
  segments,
  state,
  action,
  title,
  subtitle,
  actions,
  columns,
  data,
  loading = false,
  searchable = true,
  searchPlaceholder = "Search records…",
  filters,
  pagination,
  onRowClick,
  emptyTitle = "No records found",
  emptyDescription = "Try adjusting your search criteria or active filters.",
  bulkActions,
  selectedCount = 0,
  above,
  className = "",
}: DataWorkspaceProps<T>) {
  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  const filtered = data.filter((row) => {
    if (search) {
      const haystack = Object.values(row as Record<string, unknown>)
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(search.toLowerCase())) return false;
    }
    for (const [key, val] of Object.entries(filterValues)) {
      if (val && String((row as Record<string, unknown>)[key]) !== val) {
        return false;
      }
    }
    return true;
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className={`${styles.root} ${className}`.trim()} data-floorplan="data-workspace">
      {/* Meridian Context Boundary */}
      {segments && segments.length > 0 && (
        <MeridianBar
          segments={segments}
          state={state}
          action={action}
          copyable
          className={styles.meridianBar}
        />
      )}

      {/* Page Title & Actions */}
      {title && (
        <div className={styles.headerWrap}>
          <PageHeader title={title} description={subtitle} actions={actions} />
        </div>
      )}

      {/* Above slot (KPIs, tabs, etc.) */}
      {above && <div className={styles.aboveSlot}>{above}</div>}

      {/* Toolbar & Filter Bar */}
      {(searchable || (filters && filters.length > 0) || (selectedCount > 0 && bulkActions)) && (
        <div className={styles.toolbar}>
          {selectedCount > 0 && bulkActions ? (
            <div className={styles.bulkWrap}>
              <span className={styles.bulkCount}>{selectedCount} selected</span>
              <div className={styles.bulkActions}>{bulkActions}</div>
            </div>
          ) : (
            <>
              {searchable && (
                <div className={styles.searchWrap}>
                  <span className={styles.searchIcon} aria-hidden="true">🔍</span>
                  <input
                    type="search"
                    value={search}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                    placeholder={searchPlaceholder}
                    className={styles.searchInput}
                    aria-label="Search records"
                  />
                </div>
              )}
              {filters?.map((f) => (
                <select
                  key={f.key}
                  value={filterValues[f.key] ?? ""}
                  onChange={(e) => handleFilterChange(f.key, e.target.value)}
                  aria-label={f.label}
                  className={styles.filterSelect}
                >
                  <option value="">{f.label}: All</option>
                  {f.options.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              ))}
            </>
          )}
        </div>
      )}

      {/* Data Table Surface */}
      <div className={styles.tableCard}>
        <div className={styles.tableOverflow}>
          <table className={styles.table}>
            <thead>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    style={{ width: col.width, textAlign: col.align ?? "left" }}
                    className={styles.th}
                    scope="col"
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={`skel-${i}`}>
                    {columns.map((_, ci) => (
                      <td key={`skel-${i}-${ci}`} className={styles.td}>
                        <div
                          className={styles.skeletonBar}
                          style={{ width: ci === 0 ? "50%" : "75%" }}
                        />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className={styles.emptyCell}>
                    <div className={styles.emptyTitle}>{emptyTitle}</div>
                    <div className={styles.emptyDesc}>{emptyDescription}</div>
                  </td>
                </tr>
              ) : (
                filtered.map((row, ri) => (
                  <tr
                    key={ri}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    className={onRowClick ? styles.clickableRow : undefined}
                  >
                    {columns.map((col) => {
                      const raw = (row as Record<string, unknown>)[col.key];
                      return (
                        <td
                          key={col.key}
                          className={styles.td}
                          style={{ textAlign: col.align ?? "left" }}
                        >
                          {col.render ? col.render(raw, row) : String(raw ?? "")}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Synchronized Pagination */}
        {pagination && (
          <div className={styles.pagination}>
            <span className={styles.paginationText}>
              {pagination.total === 0
                ? "No records"
                : `Showing ${(pagination.page - 1) * pagination.pageSize + 1}–${Math.min(
                    pagination.page * pagination.pageSize,
                    pagination.total,
                  )} of ${pagination.total}`}
            </span>
            <div className={styles.paginationControls}>
              <button
                type="button"
                onClick={() => pagination.onPageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className={styles.pageBtn}
                aria-label="Previous page"
              >
                ← Prev
              </button>
              <span className={styles.pageIndicator}>
                {pagination.page} / {Math.max(1, Math.ceil(pagination.total / pagination.pageSize))}
              </span>
              <button
                type="button"
                onClick={() => pagination.onPageChange(pagination.page + 1)}
                disabled={pagination.page >= Math.ceil(pagination.total / pagination.pageSize)}
                className={styles.pageBtn}
                aria-label="Next page"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
