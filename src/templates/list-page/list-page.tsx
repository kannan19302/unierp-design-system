"use client";

import React, { useState, forwardRef, type ReactNode, type ChangeEvent, type HTMLAttributes } from "react";
import { Search } from "lucide-react";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import { PageHeader } from "../page-header";
import styles from "./list-page.module.css";

export type TemplateDensity = "ultra-compact" | "compact" | "standard" | "comfortable";
type ShellDensity = TemplateDensity;

export const listPageVariants = cva(styles.container, {
  variants: {
    density: {
      "ultra-compact": styles.density_ultra_compact,
      compact: styles.density_compact,
      standard: styles.density_standard,
      comfortable: styles.density_comfortable,
    },
  },
  defaultVariants: {
    density: "standard",
  },
});

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

export interface ListPageTemplateProps<T = Record<string, unknown>>
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof listPageVariants> {
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
  /** Strata 4-tier density scaling. */
  density?: ShellDensity;
}

function Th({ children, width }: { children: ReactNode; width?: string }) {
  return (
    <th data-slot="list-page-th" className={styles.th} style={{ width }}>
      {children}
    </th>
  );
}

function Td({ children }: { children: ReactNode }) {
  return <td data-slot="list-page-td" className={styles.td}>{children}</td>;
}


const SkeletonRow: React.FC<{ cols: number }> = ({ cols }) => (
  <tr>
    {Array.from({ length: cols }).map((_, i) => (
      <Td key={i}>
        <div
          className={styles.skeletonBar}
          style={{ inlineSize: i === 0 ? "60%" : "80%" }}
        />
      </Td>
    ))}
  </tr>
);

/**
 * `<ListPageTemplate>` — High-density, filterable tabular entity list template.
 *
 * @maturity stable
 */
function ListPageTemplateInner<T = Record<string, unknown>>(
  {
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
    density = "standard",
    className = "",
    ...props
  }: ListPageTemplateProps<T>,
  ref: React.Ref<HTMLDivElement>
) {
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
    <div
      ref={ref}
      data-slot="list-page"
      data-density={density}
      className={`${listPageVariants({ density })} ${className}`.trim()}
      {...props}
    >
      {title && (
        <PageHeader density={density} title={title} description={subtitle} actions={actions} />
      )}

      {above}

      {/* Toolbar */}
      {(searchable || filters?.length) && (
        <div data-slot="list-page-toolbar" className={styles.toolbar}>
          {searchable && (
            <div data-slot="list-page-search-wrap" className={styles.searchWrap}>
              <Search size={16} className={styles.searchIcon} aria-hidden="true" />
              <input
                data-slot="list-page-search-input"
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
              data-slot="list-page-filter-select"
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
      <div data-slot="list-page-table-card" className={styles.tableCard}>
        <div className={styles.tableOverflow}>
          <table data-slot="list-page-table" className={styles.table}>
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
                  <td colSpan={columns.length} data-slot="list-page-empty" className={styles.emptyState}>
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
          <div data-slot="list-page-pagination" className={styles.pagination}>
            <span>
              {pagination.total === 0
                ? "No results"
                : `Showing ${(pagination.page - 1) * pagination.pageSize + 1}–${Math.min(pagination.page * pagination.pageSize, pagination.total)} of ${pagination.total}`}
            </span>
            <div data-slot="list-page-pagination-actions" className={styles.paginationActions}>
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

export const ListPageTemplate = forwardRef(ListPageTemplateInner) as <
  T = Record<string, unknown>,
>(
  props: ListPageTemplateProps<T> & { ref?: React.Ref<HTMLDivElement> }
) => React.ReactElement;

(ListPageTemplate as { displayName?: string }).displayName = "ListPageTemplate";

