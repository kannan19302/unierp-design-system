"use client";

import { useState, useRef, useEffect, useMemo, forwardRef, type ForwardedRef, type ReactNode, type ChangeEvent, type MouseEvent } from "react";
import { Search, X, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { MeridianBar, type MeridianSegment, type MeridianAction, type MeridianState } from "../strata-bar";
import { StrataBar } from "../strata-bar";
import { PageHeader } from "../../templates/page-header";
import { cva } from "../../foundation/utils/cva";
import styles from "./data-shell.module.css";

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
  /** Meridian/Strata context address segments */
  segments?: MeridianSegment[] | readonly string[];
  /** Status pill at context boundary */
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
  /** Explicit list of row field keys to search; defaults to columns or string fields */
  searchableFields?: Array<keyof T | string>;
  /** Controlled search query */
  searchQuery?: string;
  /** Search change handler for server-side search or controlled input */
  onSearchChange?: (query: string) => void;
  /** Operating mode: client filters data array locally, server expects caller to paginate/filter */
  mode?: "client" | "server";
  filters?: DataWorkspaceFilter[];
  activeFilters?: Record<string, string>;
  onFilterChange?: (filters: Record<string, string>) => void;
  pagination?: DataWorkspacePagination;
  onRowClick?: (row: T) => void;
  /** Accessible name for each row's open button; defaults to its stable row key. */
  getRowActionLabel?: (row: T) => string;
  /** Function to extract a unique stable key for each row */
  getRowId?: (row: T, index: number) => string | number;
  emptyTitle?: string;
  emptyDescription?: string;
  /** Error message or alert banner to render when query fails */
  error?: ReactNode;
  /** Bulk action slot shown when rows are selected */
  bulkActions?: ReactNode;
  selectedCount?: number;
  /** Display density setting: compact, default, or comfortable */
  density?: "ultra-compact" | "compact" | "standard" | "default" | "comfortable";
  /** Whether rows can be selected with checkboxes */
  selectable?: boolean;
  /** Currently selected row keys */
  selectedRowKeys?: Array<string | number>;
  /** Selection change callback */
  onSelectionChange?: (selectedKeys: Array<string | number>, selectedRows: T[]) => void;
  /** Active sort column key */
  sortColumn?: string;
  /** Active sort direction */
  sortDirection?: "asc" | "desc" | null;
  /** Sort change callback */
  onSortChange?: (columnKey: string, direction: "asc" | "desc") => void;
  /** Custom actions slot on toolbar (right aligned) */
  toolbarActions?: ReactNode;
  /** Extra slot above the grid (e.g. KPI summary, view switcher) */
  above?: ReactNode;
  className?: string;
}

export const dataShellVariants = cva(styles.root, {
  variants: {
    density: {
      "ultra-compact": styles.densityUltraCompact,
      compact: styles.densityCompact,
      standard: styles.densityStandard,
      default: styles.densityStandard,
      comfortable: styles.densityComfortable,
    },
  },
  defaultVariants: {
    density: "standard",
  },
});

function DataWorkspaceInner<T = Record<string, unknown>>(
  {
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
    searchableFields,
    searchQuery: controlledSearch,
    onSearchChange,
    mode = "client",
    filters,
    activeFilters: controlledFilters,
    onFilterChange,
    pagination,
    onRowClick,
    getRowActionLabel,
    getRowId,
    emptyTitle = "No records found",
    emptyDescription = "Try adjusting your search criteria or active filters.",
    error,
    bulkActions,
    selectedCount,
    density = "default",
    selectable = false,
    selectedRowKeys: controlledSelectedKeys,
    onSelectionChange,
    sortColumn: controlledSortCol,
    sortDirection: controlledSortDir,
    onSortChange,
    toolbarActions,
    above,
    className = "",
  }: DataWorkspaceProps<T>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const [internalSearch, setInternalSearch] = useState("");
  const [internalFilters, setInternalFilters] = useState<Record<string, string>>({});
  const [internalSortCol, setInternalSortCol] = useState<string | undefined>(undefined);
  const [internalSortDir, setInternalSortDir] = useState<"asc" | "desc" | null>(null);
  const [internalSelectedKeys, setInternalSelectedKeys] = useState<Set<string | number>>(new Set());

  const searchInputRef = useRef<HTMLInputElement>(null);
  const headerCheckboxRef = useRef<HTMLInputElement>(null);

  // Global search shortcut (⌘K or /)
  useEffect(() => {
    if (!searchable) return;
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (
        e.key === "/" &&
        document.activeElement !== searchInputRef.current &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchable]);

  const search = controlledSearch !== undefined ? controlledSearch : internalSearch;
  const filterValues = controlledFilters !== undefined ? controlledFilters : internalFilters;
  const activeSortCol = controlledSortCol !== undefined ? controlledSortCol : internalSortCol;
  const activeSortDir = controlledSortDir !== undefined ? controlledSortDir : internalSortDir;

  const currentSelectedKeys = useMemo<Set<string | number>>(() => {
    if (controlledSelectedKeys !== undefined) {
      return new Set(controlledSelectedKeys);
    }
    return internalSelectedKeys;
  }, [controlledSelectedKeys, internalSelectedKeys]);

  const handleSearchChange = (val: string) => {
    if (controlledSearch === undefined) {
      setInternalSearch(val);
    }
    onSearchChange?.(val);
  };

  const handleClearSearch = () => {
    if (controlledSearch === undefined) {
      setInternalSearch("");
    }
    onSearchChange?.("");
    searchInputRef.current?.focus();
  };

  const handleFilterChange = (key: string, value: string) => {
    const next = { ...filterValues, [key]: value };
    if (controlledFilters === undefined) {
      setInternalFilters(next);
    }
    onFilterChange?.(next);
  };

  const handleClearFilter = (key: string) => {
    handleFilterChange(key, "");
  };

  const handleClearAllFilters = () => {
    const next: Record<string, string> = {};
    if (filters) {
      filters.forEach((f) => {
        next[f.key] = "";
      });
    }
    if (controlledFilters === undefined) {
      setInternalFilters(next);
    }
    onFilterChange?.(next);
  };

  const handleSort = (colKey: string) => {
    let nextDir: "asc" | "desc" | null = "asc";
    if (activeSortCol === colKey) {
      if (activeSortDir === "asc") nextDir = "desc";
      else if (activeSortDir === "desc") nextDir = "asc";
    }

    if (controlledSortCol === undefined) {
      setInternalSortCol(colKey);
      setInternalSortDir(nextDir);
    }
    if (nextDir) {
      onSortChange?.(colKey, nextDir);
    }
  };

  const resolveRowKey = (row: T, index: number): string | number => {
    if (getRowId) return getRowId(row, index);
    const r = row as Record<string, unknown>;
    if (r.id != null) return String(r.id);
    if (r.key != null) return String(r.key);
    if (r.uuid != null) return String(r.uuid);
    return `row-${index}`;
  };

  // Only perform local filtering in client mode
  let filtered = mode === "server"
    ? data
    : data.filter((row) => {
        if (search) {
          const lower = search.toLowerCase();
          if (searchableFields && searchableFields.length > 0) {
            const matchesField = searchableFields.some((field) => {
              const val = (row as Record<string, unknown>)[field as string];
              return val != null && String(val).toLowerCase().includes(lower);
            });
            if (!matchesField) return false;
          } else {
            const matchesCol = columns.some((col) => {
              const val = (row as Record<string, unknown>)[col.key];
              return val != null && String(val).toLowerCase().includes(lower);
            });
            if (!matchesCol) return false;
          }
        }
        for (const [key, val] of Object.entries(filterValues)) {
          if (val && String((row as Record<string, unknown>)[key]) !== val) {
            return false;
          }
        }
        return true;
      });

  // Client-side sorting
  if (mode === "client" && activeSortCol && activeSortDir) {
    filtered = [...filtered].sort((a, b) => {
      const valA = (a as Record<string, unknown>)[activeSortCol];
      const valB = (b as Record<string, unknown>)[activeSortCol];
      if (valA === valB) return 0;
      if (valA == null) return 1;
      if (valB == null) return -1;
      const cmp = String(valA).localeCompare(String(valB), undefined, { numeric: true });
      return activeSortDir === "asc" ? cmp : -cmp;
    });
  }

  // Row selection helpers
  const keyForRow = (row: T) => resolveRowKey(row, data.indexOf(row));
  const visibleRowKeys = filtered.map(keyForRow);

  const allVisibleSelected = visibleRowKeys.length > 0 && visibleRowKeys.every((k) => currentSelectedKeys.has(k));
  const someVisibleSelected = visibleRowKeys.some((k) => currentSelectedKeys.has(k)) && !allVisibleSelected;

  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = someVisibleSelected;
    }
  }, [someVisibleSelected]);

  const toggleSelectAll = () => {
    let nextKeys: Set<string | number>;
    if (allVisibleSelected) {
      nextKeys = new Set(currentSelectedKeys);
      visibleRowKeys.forEach((k) => nextKeys.delete(k));
    } else {
      nextKeys = new Set(currentSelectedKeys);
      visibleRowKeys.forEach((k) => nextKeys.add(k));
    }

    if (controlledSelectedKeys === undefined) {
      setInternalSelectedKeys(nextKeys);
    }
    const selectedRows = data.filter((row, idx) => nextKeys.has(resolveRowKey(row, idx)));
    onSelectionChange?.(Array.from(nextKeys), selectedRows);
  };

  const toggleRowSelect = (key: string | number) => {
    const nextKeys = new Set(currentSelectedKeys);
    if (nextKeys.has(key)) {
      nextKeys.delete(key);
    } else {
      nextKeys.add(key);
    }

    if (controlledSelectedKeys === undefined) {
      setInternalSelectedKeys(nextKeys);
    }
    const selectedRows = data.filter((r, idx) => nextKeys.has(resolveRowKey(r, idx)));
    onSelectionChange?.(Array.from(nextKeys), selectedRows);
  };

  const effectiveSelectedCount = selectedCount !== undefined ? selectedCount : currentSelectedKeys.size;

  const handleRowClick = (e: MouseEvent<HTMLTableRowElement>, row: T) => {
    if ((e.target as HTMLElement).closest("a, button, input, select, textarea, [role='button']")) return;
    onRowClick?.(row);
  };

  const strataAction = action
    ? action.disabled
      ? <span className={styles.contextActionWrap}><button type="button" className={styles.contextAction} disabled>{action.label}</button><span className={styles.contextActionReason}>{action.disabledReason}</span></span>
      : action.href
        ? <a className={styles.contextAction} href={action.href}>{action.label}</a>
        : <button type="button" className={styles.contextAction} onClick={action.onClick}>{action.label}</button>
    : undefined;

  // Determine active filter chips
  const activeFilterList = useMemo(() => {
    if (!filters) return [];
    const list: Array<{ key: string; label: string; valueLabel: string }> = [];
    Object.entries(filterValues).forEach(([k, v]) => {
      if (!v) return;
      const fDef = filters.find((f) => f.key === k);
      if (fDef) {
        const optDef = fDef.options.find((o) => o.value === v);
        list.push({
          key: k,
          label: fDef.label,
          valueLabel: optDef ? optDef.label : v,
        });
      }
    });
    return list;
  }, [filters, filterValues]);

  return (
    <div
      ref={ref}
      data-slot="data-shell"
      className={dataShellVariants({ density, className })}
      data-floorplan="data-workspace"
      data-density={density === "default" ? "standard" : density}
    >
      {/* Context Boundary */}
      {segments && segments.length > 0 && (
        <div data-slot="data-shell-context-bar">
          {typeof segments[0] === "string" ? (
            <StrataBar
              segments={segments as readonly string[]}
              state={
                state
                  ? {
                      kind: (state.tone as "neutral" | "success" | "warning" | "danger" | "info") || "neutral",
                      label: state.label,
                    }
                  : undefined
              }
              action={strataAction}
              className={styles.meridianBar}
            />
          ) : (
            <MeridianBar
              segments={segments as MeridianSegment[]}
              state={state}
              action={action}
              copyable
              className={styles.meridianBar}
            />
          )}
        </div>
      )}

      {/* Page Title & Actions */}
      {title && (
        <div data-slot="data-shell-header" className={styles.headerWrap}>
          <PageHeader title={title} description={subtitle} actions={actions} />
        </div>
      )}

      {/* Error state */}
      {error && <div className={styles.errorWrap} role="alert">{error}</div>}

      {/* Above slot (KPIs, tabs, etc.) */}
      {above && <div className={styles.aboveSlot}>{above}</div>}

      {/* Toolbar & Filter Bar */}
      {(searchable || (filters && filters.length > 0) || (effectiveSelectedCount > 0 && bulkActions) || toolbarActions) && (
        <div data-slot="data-shell-toolbar" className={styles.toolbar}>
          {effectiveSelectedCount > 0 && bulkActions ? (
            <div className={styles.bulkWrap}>
              <span className={styles.bulkCount}>{effectiveSelectedCount} selected</span>
              <div className={styles.bulkActions}>{bulkActions}</div>
            </div>
          ) : (
            <>
              {searchable && (
                <div className={styles.searchWrap}>
                  <Search size={16} className={styles.searchIcon} aria-hidden="true" />
                  <input
                    ref={searchInputRef}
                    type="search"
                    value={search}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleSearchChange(e.target.value)}
                    placeholder={searchPlaceholder}
                    className={styles.searchInput}
                    aria-label="Search records"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className={styles.searchClearBtn}
                      aria-label="Clear search"
                    >
                      <X size={14} />
                    </button>
                  )}
                  <kbd className={styles.searchKbd}>⌘K</kbd>
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
              {toolbarActions && (
                <div style={{ marginInlineStart: "auto", display: "flex", alignItems: "center", gap: "var(--space-2)", flexWrap: "wrap", minInlineSize: 0, maxInlineSize: "100%" }}>
                  {toolbarActions}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Active Filter Chips */}
      {activeFilterList.length > 0 && effectiveSelectedCount === 0 && (
        <div className={styles.activeFiltersWrap}>
          {activeFilterList.map((af) => (
            <span key={af.key} className={styles.filterChip}>
              <strong>{af.label}:</strong> {af.valueLabel}
              <button
                type="button"
                onClick={() => handleClearFilter(af.key)}
                className={styles.filterChipDismiss}
                aria-label={`Remove filter ${af.label}`}
              >
                <X size={12} />
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={handleClearAllFilters}
            className={styles.clearAllFiltersBtn}
          >
            Clear all
          </button>
        </div>
      )}

      {/* Data Table Surface */}
      <div data-slot="data-shell-table-wrapper" className={styles.tableCard}>
        <div className={styles.tableOverflow} role="region" aria-label={`${title ?? "Records"} table`} tabIndex={0} aria-busy={loading}>
          <table data-slot="data-shell-table" className={styles.table}>
            <caption className={styles.visuallyHidden}>{title ?? "Records"}</caption>
            <thead>
              <tr>
                {selectable && (
                  <th className={`${styles.th} ${styles.checkboxTh}`} scope="col">
                    <input
                      ref={headerCheckboxRef}
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={toggleSelectAll}
                      className={styles.checkboxInput}
                      aria-label="Select all visible records"
                    />
                  </th>
                )}
                {columns.map((col) => {
                  const isSorted = activeSortCol === col.key;
                  return (
                    <th
                      key={col.key}
                      style={{ width: col.width, textAlign: col.align ?? "left" }}
                      className={`${styles.th} ${col.sortable ? styles.thSortable : ""}`}
                      scope="col"
                      aria-sort={col.sortable ? (isSorted ? (activeSortDir === "asc" ? "ascending" : "descending") : "none") : undefined}
                    >
                      {col.sortable ? <button type="button" className={styles.thSortContent} onClick={() => handleSort(col.key)}>
                        <span>{col.header}</span>
                        {(
                          isSorted ? (
                            activeSortDir === "asc" ? (
                              <ArrowUp className={`${styles.sortIcon} ${styles.sortIconActive}`} aria-hidden="true" />
                            ) : (
                              <ArrowDown className={`${styles.sortIcon} ${styles.sortIconActive}`} aria-hidden="true" />
                            )
                          ) : (
                            <ArrowUpDown className={styles.sortIcon} aria-hidden="true" />
                          )
                        )}
                      </button> : <span className={styles.thSortContent}>{col.header}</span>}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={`skel-${i}`}>
                    {selectable && (
                      <td className={`${styles.td} ${styles.checkboxTd}`}>
                        <div className={styles.skeletonBar} style={{ width: "var(--space-4, 16px)" }} />
                      </td>
                    )}
                    {columns.map((_, ci) => (
                      <td key={`skel-${i}-${ci}`} className={styles.td}>
                        {i === 0 && ci === 0 && <span role="status" className={styles.visuallyHidden}>Loading records</span>}
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
                  <td colSpan={columns.length + (selectable ? 1 : 0)} className={styles.emptyCell}>
                    <div className={styles.emptyTitle}>{emptyTitle}</div>
                    <div className={styles.emptyDesc}>{emptyDescription}</div>
                  </td>
                </tr>
              ) : (
                filtered.map((row) => {
                  const rowKey = keyForRow(row);
                  const isSelected = currentSelectedKeys.has(rowKey);
                  return (
                    <tr
                      key={rowKey}
                      onClick={onRowClick ? (e) => handleRowClick(e, row) : undefined}
                      data-selected={isSelected ? "true" : undefined}
                      className={`${onRowClick ? styles.clickableRow : ""} ${isSelected ? styles.selectedRow : ""}`.trim() || undefined}
                    >
                      {selectable && (
                        <td className={`${styles.td} ${styles.checkboxTd}`}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleRowSelect(rowKey)}
                            className={styles.checkboxInput}
                            aria-label={`Select row ${rowKey}`}
                          />
                        </td>
                      )}
                      {columns.map((col, columnIndex) => {
                        const raw = (row as Record<string, unknown>)[col.key];
                        const content = col.render ? col.render(raw, row) : String(raw ?? "");
                        return (
                          <td
                            key={col.key}
                            className={styles.td}
                            style={{ textAlign: col.align ?? "left" }}
                          >
                            {content}
                            {columnIndex === 0 && onRowClick && (
                              <button
                                type="button"
                                className={styles.rowAction}
                                aria-label={getRowActionLabel?.(row) ?? `Open record ${rowKey}`}
                                onClick={(e) => { e.stopPropagation(); onRowClick(row); }}
                              >Open</button>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Synchronized Pagination */}
        {pagination && (
          <div data-slot="data-shell-pagination" className={styles.pagination}>
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

/**
 * `<DataWorkspace>` — High-density data grid workbench floorplan with context bar, search/filtering, pagination, and empty/error states.
 * @maturity stable
 */
export const DataWorkspace = forwardRef(DataWorkspaceInner) as <T = Record<string, unknown>>(
  props: DataWorkspaceProps<T> & { ref?: React.Ref<HTMLDivElement> }
) => React.ReactElement;

(DataWorkspace as any).displayName = "DataWorkspace";

// Directory-level alias
export const DataShell = DataWorkspace;
export type DataShellProps<T = Record<string, unknown>> = DataWorkspaceProps<T>;
