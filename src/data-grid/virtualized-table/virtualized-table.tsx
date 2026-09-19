"use client";

import {
  forwardRef,
  useState,
  useMemo,
  useRef,
  useCallback,
  type ReactNode,
  type UIEvent,
  type ForwardedRef,
  type Ref,
  type ReactElement,
} from "react";

import { ArrowUpDown, ArrowUp, ArrowDown, Search } from "lucide-react";
import styles from "./virtualized-table.module.css";

export interface VirtualizedColumn<T> {
  key: string;
  header: ReactNode;
  width: number;
  minWidth?: number;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  pinned?: "left";
  render?: (row: T, index: number) => ReactNode;
}

export interface VirtualizedTableProps<T> {
  data: T[];
  columns: VirtualizedColumn<T>[];
  rowHeight?: number;
  viewportHeight?: number;
  overscan?: number;
  rowKey: (row: T, index: number) => string;
  selectedKeys?: string[];
  onSelectionChange?: (keys: string[]) => void;
  onRowClick?: (row: T) => void;
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchFilter?: (row: T, query: string) => boolean;
  className?: string;
  emptyMessage?: string;
}

function VirtualizedTableInner<T extends Record<string, any>>(
  {
    data,
    columns,
    rowHeight = 36,
    viewportHeight = 440,
    overscan = 5,
    rowKey,
    selectedKeys = [],
    onSelectionChange,
    onRowClick,
    showSearch = true,
    searchPlaceholder = "Search virtual records...",
    searchFilter,
    className = "",
    emptyMessage = "No matching records found",
  }: VirtualizedTableProps<T>,
  ref: ForwardedRef<HTMLDivElement>
): ReactElement | null {
  const [scrollTop, setScrollTop] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const viewportRef = useRef<HTMLDivElement>(null);

  // Filter data
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;
    const q = searchQuery.toLowerCase().trim();
    if (searchFilter) {
      return data.filter((row) => searchFilter(row, q));
    }
    return data.filter((row) =>
      Object.values(row).some((val) =>
        String(val ?? "").toLowerCase().includes(q)
      )
    );
  }, [data, searchQuery, searchFilter]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal === bVal) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const cmp = aVal < bVal ? -1 : 1;
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filteredData, sortKey, sortDir]);

  // Virtualization math
  const totalCount = sortedData.length;
  const totalHeight = totalCount * rowHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const visibleCount = Math.ceil(viewportHeight / rowHeight) + 2 * overscan;
  const endIndex = Math.min(totalCount, startIndex + visibleCount);

  const visibleRows = useMemo(() => {
    const rows: { row: T; index: number; key: string; top: number }[] = [];
    for (let i = startIndex; i < endIndex; i++) {
      const row = sortedData[i];
      if (row) {
        rows.push({
          row,
          index: i,
          key: rowKey(row, i),
          top: i * rowHeight,
        });
      }
    }
    return rows;
  }, [sortedData, startIndex, endIndex, rowHeight, rowKey]);

  // Total columns width
  const totalWidth = useMemo(() => {
    let w = columns.reduce((acc, col) => acc + col.width, 0);
    if (onSelectionChange) w += 44;
    return w;
  }, [columns, onSelectionChange]);

  const handleScroll = useCallback((e: UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const toggleSort = (key: string, sortable?: boolean) => {
    if (!sortable) return;
    if (sortKey === key) {
      if (sortDir === "asc") setSortDir("desc");
      else {
        setSortKey(null);
        setSortDir("asc");
      }
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const toggleSelectRow = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onSelectionChange) return;
    if (selectedKeys.includes(key)) {
      onSelectionChange(selectedKeys.filter((k) => k !== key));
    } else {
      onSelectionChange([...selectedKeys, key]);
    }
  };

  const toggleSelectAll = () => {
    if (!onSelectionChange) return;
    if (selectedKeys.length === sortedData.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(sortedData.map((row, i) => rowKey(row, i)));
    }
  };

  return (
    <div ref={ref} className={`${styles.container} ${className}`}>
      {showSearch && (
        <div className={styles.toolbar}>
          <div className={styles.toolbarLeft}>
            <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
              <Search
                size={14}
                style={{
                  position: "absolute",
                  insetInlineStart: "var(--space-3)",
                  color: "var(--color-text-secondary)",
                  pointerEvents: "none",
                }}
              />
              <input
                type="text"
                className={styles.searchInput}
                style={{ paddingInlineStart: "var(--space-8)" }}
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Filter rows"
              />
            </div>
            <span className={styles.badge}>
              {sortedData.length.toLocaleString()} of {data.length.toLocaleString()} items
            </span>
          </div>
          {onSelectionChange && selectedKeys.length > 0 && (
            <div className={styles.toolbarRight}>
              <span className={styles.badge} style={{ background: "var(--color-brand-subtle)", color: "var(--color-brand)" }}>
                {selectedKeys.length} selected
              </span>
            </div>
          )}
        </div>
      )}

      <div
        ref={viewportRef}
        className={styles.viewport}
        style={{ blockSize: viewportHeight }}
        onScroll={handleScroll}
        tabIndex={0}
        role="grid"
        aria-rowcount={totalCount}
        aria-colcount={columns.length}
      >
        <div style={{ minInlineSize: totalWidth }}>
          {/* Header Row */}
          <div className={styles.headerRow} role="row" aria-rowindex={1}>
            {onSelectionChange && (
              <div
                className={`${styles.headerCell} ${styles.pinnedLeft}`}
                style={{ inlineSize: 44, minInlineSize: 44, justifyContent: "center" }}
                role="columnheader"
              >
                <input
                  type="checkbox"
                  checked={sortedData.length > 0 && selectedKeys.length === sortedData.length}
                  onChange={toggleSelectAll}
                  aria-label="Select all rows"
                />
              </div>
            )}
            {columns.map((col) => {
              const isSorted = sortKey === col.key;
              const alignClass =
                col.align === "center"
                  ? styles.alignCenter
                  : col.align === "right"
                  ? styles.alignRight
                  : styles.alignLeft;
              const pinnedClass = col.pinned === "left" ? styles.pinnedLeft : "";

              return (
                <div
                  key={col.key}
                  className={`${styles.headerCell} ${col.sortable ? styles.sortableHeader : ""} ${alignClass} ${pinnedClass}`}
                  style={{ inlineSize: col.width, minInlineSize: col.minWidth ?? col.width }}
                  onClick={() => toggleSort(col.key, col.sortable)}
                  role="columnheader"
                  aria-sort={isSorted ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
                >
                  <span>{col.header}</span>
                  {col.sortable && (
                    <span style={{ display: "inline-flex", marginInlineStart: "var(--space-1)" }}>
                      {isSorted ? (
                        sortDir === "asc" ? (
                          <ArrowUp size={12} />
                        ) : (
                          <ArrowDown size={12} />
                        )
                      ) : (
                        <ArrowUpDown size={12} style={{ opacity: 0.4 }} />
                      )}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Virtual Rows Container */}
          <div className={styles.virtualContent} style={{ blockSize: totalHeight }}>
            {totalCount === 0 ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  blockSize: 180,
                  color: "var(--color-text-secondary)",
                }}
              >
                {emptyMessage}
              </div>
            ) : (
              visibleRows.map(({ row, index, key, top }) => {
                const isSelected = selectedKeys.includes(key);

                return (
                  <div
                    key={key}
                    className={`${styles.row} ${isSelected ? styles.rowSelected : ""}`}
                    style={{ insetBlockStart: top, blockSize: rowHeight }}
                    role="row"
                    aria-rowindex={index + 2}
                    aria-selected={isSelected}
                    onClick={() => onRowClick?.(row)}
                  >
                    {onSelectionChange && (
                      <div
                        className={`${styles.cell} ${styles.pinnedLeft}`}
                        style={{ inlineSize: 44, minInlineSize: 44, justifyContent: "center" }}
                        role="gridcell"
                        onClick={(e) => toggleSelectRow(key, e)}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          aria-label={`Select row ${index + 1}`}
                        />
                      </div>
                    )}
                    {columns.map((col) => {
                      const alignClass =
                        col.align === "center"
                          ? styles.alignCenter
                          : col.align === "right"
                          ? styles.alignRight
                          : styles.alignLeft;
                      const pinnedClass = col.pinned === "left" ? styles.pinnedLeft : "";

                      return (
                        <div
                          key={col.key}
                          className={`${styles.cell} ${alignClass} ${pinnedClass}`}
                          style={{ inlineSize: col.width, minInlineSize: col.minWidth ?? col.width }}
                          role="gridcell"
                        >
                          {col.render ? col.render(row, index) : String(row[col.key] ?? "")}
                        </div>
                      );
                    })}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <span>
          Showing rows {totalCount > 0 ? (startIndex + 1).toLocaleString() : 0} to{" "}
          {Math.min(endIndex, totalCount).toLocaleString()} of {totalCount.toLocaleString()}
        </span>
        <span>Virtual Window Active (Overscan: {overscan})</span>
      </div>
    </div>
  );
}

/**
 * VirtualizedTable renders high-performance virtualized rows for large enterprise datasets.
 *
 * @maturity stable
 */
export const VirtualizedTable = forwardRef(VirtualizedTableInner) as <
  T extends Record<string, any>
>(
  props: VirtualizedTableProps<T> & { ref?: Ref<HTMLDivElement> }
) => ReactElement | null;

(VirtualizedTable as { displayName?: string }).displayName = "VirtualizedTable";
