"use client";

import React, { useState, type ReactNode, type ChangeEvent } from "react";
import { PageHeader } from "../page-header";
import styles from "./list-page-template.module.css";

export interface ListColumn<T = Record<string, unknown>> {
  key: string;
  header: string;
  render?: (value: unknown, row: T) => ReactNode;
  width?: string;
}

export interface ListPageFilter {
  key: string;
  label: string;
  options: Array<{ label: string; value: string }>;
}

export interface ListPaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export interface ListPageTemplateProps<T = Record<string, unknown>> {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  columns: ListColumn<T>[];
  data: T[];
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  filters?: ListPageFilter[];
  pagination?: ListPaginationProps;
  onRowClick?: (row: T) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  /** Extra content between header and table (charts, tabs, etc.) */
  above?: ReactNode;
}

function Th({ children, width }: { children: ReactNode; width?: string }) {
  return (
    <th className={styles.th} style={{ width }}>
      {children}
    </th>
  );
}

function Td({ children }: { children: ReactNode }) {
  return <td className={styles.td}>{children}</td>;
}

const SkeletonRow: React.FC<{ cols: number }> = ({ cols }) => (
  <tr>
    {Array.from({ length: cols }).map((_, i) => (
      <Td key={i}>
        <div
          className={styles.skeletonBar}
          style={{ width: i === 0 ? "60%" : "80%" }}
        />
      </Td>
    ))}
  </tr>
);

export function ListPageTemplate<T = Record<string, unknown>>({
  title,
  subtitle,
  actions,
  columns,
  data,
  loading = false,
  searchable = true,
  searchPlaceholder = "Search…",
  filters,
  pagination,
  onRowClick,
  emptyTitle = "No results",
  emptyDescription = "Try adjusting your search or filters.",
  above,
}: ListPageTemplateProps<T>) {
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
      if (val && String((row as Record<string, unknown>)[key]) !== val)
        return false;
    }
    return true;
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className={styles.container}>
      {title && (
        <PageHeader title={title} description={subtitle} actions={actions} />
      )}

      {above}

      {/* Toolbar */}
      {(searchable || filters?.length) && (
        <div className={styles.toolbar}>
          {searchable && (
            <div className={styles.searchWrap}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                type="search"
                value={search}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setSearch(e.target.value)
                }
                placeholder={searchPlaceholder}
                className={styles.searchInput}
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
        </div>
      )}

      {/* Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableOverflow}>
          <table className={styles.table}>
            <thead>
              <tr>
                {columns.map((col) => (
                  <Th key={col.key} width={col.width}>
                    {col.header}
                  </Th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonRow key={i} cols={columns.length} />
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className={styles.emptyState}>
                    <div className={styles.emptyTitle}>{emptyTitle}</div>
                    <div>{emptyDescription}</div>
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
                        <Td key={col.key}>
                          {col.render
                            ? col.render(raw, row)
                            : String(raw ?? "")}
                        </Td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && (
          <div className={styles.pagination}>
            <span>
              {pagination.total === 0
                ? "No results"
                : `Showing ${(pagination.page - 1) * pagination.pageSize + 1}–${Math.min(pagination.page * pagination.pageSize, pagination.total)} of ${pagination.total}`}
            </span>
            <div className={styles.paginationActions}>
              <button
                type="button"
                onClick={() => pagination.onPageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className={styles.pageBtn}
              >
                ← Prev
              </button>
              <span>
                {pagination.page} /{" "}
                {Math.max(1, Math.ceil(pagination.total / pagination.pageSize))}
              </span>
              <button
                type="button"
                onClick={() => pagination.onPageChange(pagination.page + 1)}
                disabled={
                  pagination.page >=
                  Math.ceil(pagination.total / pagination.pageSize)
                }
                className={styles.pageBtn}
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
