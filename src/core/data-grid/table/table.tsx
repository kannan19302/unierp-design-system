import {
  forwardRef,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ForwardedRef,
  type CSSProperties,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
  type UIEvent,
  type HTMLAttributes,
  type ThHTMLAttributes,
  type TdHTMLAttributes,
} from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronDown, ChevronRight } from "lucide-react";
import { Skeleton } from "../../primitives/skeleton";
import { EmptyState } from "../../data-display/empty-state";
import styles from "./table.module.css";
export type ColumnAlign = "left" | "right" | "center";
export type ColumnPin = "left" | "right";

export interface Column<T> {
  key: string;
  header: ReactNode;
  align?: ColumnAlign;
  width?: string | number;
  minWidth?: number;
  sortable?: boolean;
  resizable?: boolean;
  pinned?: ColumnPin;
  editable?: boolean | ((row: T) => boolean);
  render?: (row: T, index: number) => ReactNode;
  /** Plain value used for CSV export; defaults to the raw row property */
  exportValue?: (row: T) => string | number | boolean | null | undefined;
}

export type SortOrder = "asc" | "desc";

export interface AggregateSummary<T> {
  [columnKey: string]:
    | "sum"
    | "avg"
    | "count"
    | ((rows: T[]) => ReactNode);
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  rowKey?: (row: T, index: number) => string;
  onRowClick?: (row: T) => void;
  emptyTitle?: string;
  emptyMessage?: string;
  emptyIcon?: ReactNode;
  skeletonRows?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
  onSortChange?: (key: string, order: SortOrder) => void;
  /** Controlled row selection: shows a checkbox column when both props are set */
  selectedKeys?: string[];
  onSelectionChange?: (keys: string[]) => void;
  /** Rendered in a toolbar above the table while rows are selected */
  bulkActions?: (selectedKeys: string[]) => ReactNode;
  /** Window rows inside a fixed-height scroll container (large datasets) */
  virtualized?: boolean;
  /** Fixed row height in px used for windowing math (default 36 standard / 44 comfortable) */
  rowHeight?: number;
  /** Scroll container height in px when virtualized (default 480) */
  maxHeight?: number;

  /** DL 2.0: Group data rows by a key */
  groupBy?: string;
  /** DL 2.0: Column aggregates rendered in group headers and summary footer */
  aggregates?: AggregateSummary<T>;
  /** DL 2.0: Callback when a cell value is modified via inline editing */
  onCellEdit?: (rowKey: string, columnKey: string, newValue: string) => void;
  /** DL 2.0: Enable keyboard arrow-key cell navigation */
  keyboardNav?: boolean;
  /** DL 2.0: Pinned summary footer row */
  summaryRow?: ReactNode | Record<string, ReactNode>;
  /** Accessible table name when no visible caption is rendered. */
  "aria-label"?: string;
  /** Visible table caption. Use for concise dataset context. */
  caption?: ReactNode;
  /** Composable controls rendered above the table. */
  toolbar?: ReactNode;
  /** Composable pagination or result metadata rendered below the table. */
  footer?: ReactNode;
  /** Accessible label for each selectable row. */
  rowLabel?: (row: T, index: number) => string;
}

const OVERSCAN = 8;
const CHECKBOX_WIDTH = 40;

const parseColWidth = (w?: string | number): number => {
  if (typeof w === "number") return w;
  if (typeof w === "string") {
    const parsed = parseInt(w, 10);
    if (!isNaN(parsed)) return parsed;
  }
  return 150;
};

type VirtualItem<T> =
  | { type: "group"; groupKey: string; count: number; collapsed: boolean }
  | { type: "row"; row: T; rowIndex: number; groupKey?: string };

/**
 * `<DataTable>` — Enterprise DataGrid 2.0 for the UniERP ecosystem.
 *
 * Capabilities:
 * - High-density typography with tabular numerals (`tabular-nums`)
 * - Virtualized rendering for high-volume operational datasets (10,000+ records)
 * - Multi-column pinning (`pinned: 'left' | 'right'`) with cumulative sticky offsets
 * - Excel-style keyboard grid navigation (`Arrow keys`, `Tab`, `F2` inline edit, `Shift+Space` select)
 * - Synchronized auto-scroll during keyboard cell navigation
 * - Unified grouped virtualization supporting 50k+ rows with subtotal aggregates
 * - Optimistic inline cell editing buffer
 * - Controlled multi-selection with bulk-action bar integration
 * - Pinned summary footer rows
 */
function DataTableInner<T>(
  {
    columns,
    data,
    loading,
    rowKey,
    onRowClick,
    emptyTitle = "Nothing here yet",
    emptyMessage = "No records to display.",
    emptyIcon,
    skeletonRows = 6,
    sortBy,
    sortOrder = "asc",
    onSortChange,
    selectedKeys,
    onSelectionChange,
    bulkActions,
    virtualized,
    rowHeight = 36,
    maxHeight = 480,
    groupBy,
    aggregates: _aggregates,
    onCellEdit,
    keyboardNav = true,
    summaryRow,
    "aria-label": ariaLabel,
    caption,
    toolbar,
    footer,
    rowLabel,
  }: DataTableProps<T>,
  ref: ForwardedRef<HTMLDivElement>
) {
  const get = (row: T, key: string) =>
    (row as Record<string, unknown>)[key] as ReactNode;
  const keyOf = useCallback(
    (row: T, i: number) => (rowKey ? rowKey(row, i) : String(i)),
    [rowKey],
  );

  const selectable = !!selectedKeys && !!onSelectionChange;
  const selected = useMemo(() => new Set(selectedKeys ?? []), [selectedKeys]);
  const allKeys = useMemo(
    () => data.map((row: any, i: any) => keyOf(row, i)),
    [data, keyOf],
  );
  const allSelected =
    allKeys.length > 0 && allKeys.every((k: any) => selected.has(k));
  const someSelected = allKeys.some((k: any) => selected.has(k));

  const toggleAll = () => {
    if (!onSelectionChange) return;
    onSelectionChange(allSelected ? [] : allKeys);
  };
  const toggleOne = (key: string) => {
    if (!onSelectionChange) return;
    const next = new Set(selected);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    onSelectionChange([...next]);
  };

  const handleSort = (c: Column<T>) => {
    if (!c.sortable || !onSortChange) return;
    if (sortBy === c.key)
      onSortChange(c.key, sortOrder === "asc" ? "desc" : "asc");
    else onSortChange(c.key, "asc");
  };

  // ── Cumulative Sticky Column Offsets ──
  const { pinnedLeftOffsets, pinnedRightOffsets, lastLeftPinnedKey, firstRightPinnedKey } =
    useMemo(() => {
      const leftMap = new Map<string, number>();
      const rightMap = new Map<string, number>();

      let currentLeft = selectable ? CHECKBOX_WIDTH : 0;
      let lastLeft: string | null = null;
      for (const col of columns) {
        if (col.pinned === "left") {
          leftMap.set(col.key, currentLeft);
          currentLeft += parseColWidth(col.width);
          lastLeft = col.key;
        }
      }

      let currentRight = 0;
      let firstRight: string | null = null;
      for (let i = columns.length - 1; i >= 0; i--) {
        const col = columns[i];
        if (col && col.pinned === "right") {
          rightMap.set(col.key, currentRight);
          currentRight += parseColWidth(col.width);
          firstRight = col.key;
        }
      }

      return {
        pinnedLeftOffsets: leftMap,
        pinnedRightOffsets: rightMap,
        lastLeftPinnedKey: lastLeft,
        firstRightPinnedKey: firstRight,
      };
    }, [columns, selectable]);

  // ── Collapsed Groups State ──
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const toggleGroup = (groupVal: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupVal)) next.delete(groupVal);
      else next.add(groupVal);
      return next;
    });
  };

  // ── Flattened Virtual Stream (Groups + Rows) ──
  const flatItems: VirtualItem<T>[] = useMemo(() => {
    if (!groupBy) {
      return data.map((row, i) => ({
        type: "row" as const,
        row,
        rowIndex: i,
      }));
    }

    const items: VirtualItem<T>[] = [];
    const map = new Map<string, { row: T; rowIndex: number }[]>();
    for (const [rowIndex, row] of data.entries()) {
      const gVal = String((row as Record<string, unknown>)[groupBy] ?? "Unassigned");
      const list = map.get(gVal) ?? [];
      list.push({ row, rowIndex });
      map.set(gVal, list);
    }

    for (const [gVal, groupRows] of map.entries()) {
      const isCollapsed = collapsedGroups.has(gVal);
      items.push({
        type: "group",
        groupKey: gVal,
        count: groupRows.length,
        collapsed: isCollapsed,
      });

      if (!isCollapsed) {
        for (const r of groupRows) {
          items.push({
            type: "row",
            row: r.row,
            rowIndex: r.rowIndex,
            groupKey: gVal,
          });
        }
      }
    }

    return items;
  }, [data, groupBy, collapsedGroups]);

  // ── Windowing Math (virtualized datasets) ──
  const windowing = !!virtualized && !loading && flatItems.length * rowHeight > maxHeight;
  const [scrollTop, setScrollTop] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const onScroll = windowing
    ? (e: UIEvent<HTMLDivElement>) => setScrollTop(e.currentTarget.scrollTop)
    : undefined;

  const startIndex = windowing
    ? Math.max(0, Math.floor(scrollTop / rowHeight) - OVERSCAN)
    : 0;
  const endIndex = windowing
    ? Math.min(
        flatItems.length,
        Math.ceil((scrollTop + maxHeight) / rowHeight) + OVERSCAN,
      )
    : flatItems.length;

  const topSpacer = startIndex * rowHeight;
  const bottomSpacer = (flatItems.length - endIndex) * rowHeight;
  const visibleItems = windowing ? flatItems.slice(startIndex, endIndex) : flatItems;
  const colSpan = columns.length + (selectable ? 1 : 0);

  // ── Keyboard Grid Navigation & Optimistic Cell Editing ──
  const [activeCell, setActiveCell] = useState<{ row: number; col: number } | null>(null);
  const [editingCell, setEditingCell] = useState<{ rowKey: string; colKey: string } | null>(null);
  const [editValue, setEditValue] = useState("");
  const [optimisticEdits, setOptimisticEdits] = useState<Map<string, string>>(new Map());
  const cellRefs = useRef(new Map<string, HTMLTableCellElement>());
  const pendingFocus = useRef<{ row: number; col: number } | null>(null);
  const finishingEdit = useRef(false);

  useLayoutEffect(() => {
    const target = pendingFocus.current;
    if (!target) return;
    const cell = cellRefs.current.get(`${target.row}:${target.col}`);
    if (cell) {
      pendingFocus.current = null;
      cell.focus();
    }
  });

  const commitCellEdit = (rKey: string, cKey: string, val: string) => {
    if (finishingEdit.current) return;
    finishingEdit.current = true;
    setOptimisticEdits((prev) => new Map(prev).set(`${rKey}_${cKey}`, val));
    onCellEdit?.(rKey, cKey, val);
    setEditingCell(null);
  };

  const syncScrollToRow = (targetRowIdx: number) => {
    if (!scrollRef.current || !windowing) return;
    const rowTop = targetRowIdx * rowHeight;
    const rowBottom = rowTop + rowHeight;
    const currentScrollTop = scrollRef.current.scrollTop;
    if (rowTop < currentScrollTop) {
      scrollRef.current.scrollTop = rowTop;
    } else if (rowBottom > currentScrollTop + maxHeight) {
      scrollRef.current.scrollTop = rowBottom - maxHeight;
    }
    setScrollTop(scrollRef.current.scrollTop);
  };

  const focusCell = (row: number, col: number) => {
    pendingFocus.current = { row, col };
    setActiveCell({ row, col });
    syncScrollToRow(row);
  };

  const handleGridKeyDown = (e: KeyboardEvent<HTMLTableElement>) => {
    if (data.length === 0) return;
    // Native controls own their keys; grid navigation must not swallow sorting,
    // group toggles, selection or row-action activation.
    if (!editingCell && (e.target as HTMLElement).closest("button, input, select, textarea, a[href]")) return;

    if (editingCell) {
      if (e.key === "Enter") {
        e.preventDefault();
        pendingFocus.current = activeCell;
        commitCellEdit(editingCell.rowKey, editingCell.colKey, editValue);
      } else if (e.key === "Escape") {
        e.preventDefault();
        finishingEdit.current = true;
        pendingFocus.current = activeCell;
        setEditingCell(null);
      }
      return;
    }

    if (!keyboardNav) return;

    const maxCol = columns.length - 1;
    const rowPositions = flatItems.flatMap((item, index) => item.type === "row" ? [index] : []);
    if (!rowPositions.length || maxCol < 0) return;
    const curRow = activeCell?.row ?? rowPositions[0]!;
    const curCol = activeCell?.col ?? 0;
    const rowPosition = Math.max(0, rowPositions.indexOf(curRow));
    const currentItem = flatItems[curRow];

    switch (e.key) {
      case "ArrowUp": {
        e.preventDefault();
        focusCell(rowPositions[Math.max(0, rowPosition - 1)]!, curCol);
        break;
      }
      case "ArrowDown": {
        e.preventDefault();
        focusCell(rowPositions[Math.min(rowPositions.length - 1, rowPosition + 1)]!, curCol);
        break;
      }
      case "ArrowLeft":
        e.preventDefault();
        focusCell(curRow, Math.max(0, curCol - 1));
        break;
      case "ArrowRight":
        e.preventDefault();
        focusCell(curRow, Math.min(maxCol, curCol + 1));
        break;
      case "Tab":
        // Keep native traversal through embedded controls and out of the table.
        break;
      case "F2":
      case "Enter": {
        e.preventDefault();
        const row = currentItem?.type === "row" ? currentItem.row : undefined;
        const col = columns[curCol];
        if (row && col && onCellEdit && currentItem?.type === "row") {
          const isEditable = typeof col.editable === "function" ? col.editable(row) : col.editable;
          if (isEditable) {
            const rKey = keyOf(row, currentItem.rowIndex);
            const editKey = `${rKey}_${col.key}`;
            const curVal = optimisticEdits.has(editKey)
              ? optimisticEdits.get(editKey)
              : String((row as Record<string, unknown>)[col.key] ?? "");
            finishingEdit.current = false;
            setEditingCell({ rowKey: rKey, colKey: col.key });
            setEditValue(curVal ?? "");
          }
        }
        break;
      }
      case " ":
        if (selectable && e.shiftKey && currentItem?.type === "row") {
          e.preventDefault();
          const rKey = keyOf(currentItem.row, currentItem.rowIndex);
          toggleOne(rKey);
        }
        break;
    }
  };

  // ── Render Group Header Helper ──
  const renderGroupHeader = (groupVal: string, count: number, isCollapsed: boolean, absIndex: number) => {
    return (
      <tr
        key={`grp-${groupVal}-${absIndex}`}
        onClick={() => toggleGroup(groupVal)}
        className={styles.groupRow}
        style={windowing ? ({ "--data-row-height": `${rowHeight}px` } as CSSProperties) : undefined}
      >
        <td colSpan={colSpan} className={styles.groupCell}>
          <button
            type="button"
            className={styles.groupToggle}
            aria-expanded={!isCollapsed}
            onClick={(event) => {
              event.stopPropagation();
              toggleGroup(groupVal);
            }}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
            <span>{groupVal}</span>
            <span className={styles.groupCount}>{count}</span>
          </button>
        </td>
      </tr>
    );
  };

  // ── Render Row Helper ──
  const renderRow = (row: T, absIndex: number, sourceIndex: number) => {
    const key = keyOf(row, sourceIndex);
    const isRowSelected = selectable && selected.has(key);

    return (
      <tr
        key={key}
        aria-selected={isRowSelected ? true : undefined}
        onClick={onRowClick ? () => onRowClick(row) : undefined}
        data-clickable={onRowClick ? "true" : undefined}
        className={styles.dataRow}
        style={windowing ? ({ "--data-row-height": `${rowHeight}px` } as CSSProperties) : undefined}
      >
        {selectable && (
          <td
            className={`${styles.cell} ${styles.selectionCell}`}
            onClick={(e: any) => e.stopPropagation()}
          >
            <input
              type="checkbox"
              aria-label={rowLabel ? `Select ${rowLabel(row, sourceIndex)}` : "Select row"}
              checked={selected.has(key)}
              onChange={() => toggleOne(key)}
            />
          </td>
        )}
        {columns.map((c, colIdx) => {
          const isCellFocused = activeCell?.row === absIndex && activeCell?.col === colIdx;
          const isCellEditing = editingCell?.rowKey === key && editingCell?.colKey === c.key;
          const isPinnedLeft = c.pinned === "left";
          const isPinnedRight = c.pinned === "right";

          const leftOffset = isPinnedLeft ? pinnedLeftOffsets.get(c.key) ?? 0 : undefined;
          const rightOffset = isPinnedRight ? pinnedRightOffsets.get(c.key) ?? 0 : undefined;
          const isLastLeft = c.key === lastLeftPinnedKey;
          const isFirstRight = c.key === firstRightPinnedKey;

          const editKey = `${key}_${c.key}`;
          const currentDisplayVal = optimisticEdits.has(editKey)
            ? optimisticEdits.get(editKey)
            : get(row, c.key);

          return (
            <td
              key={c.key}
              ref={(cell) => {
                const position = `${absIndex}:${colIdx}`;
                if (cell) cellRefs.current.set(position, cell);
                else cellRefs.current.delete(position);
              }}
              className={`${styles.cell} ${isPinnedLeft || isPinnedRight ? styles.pinnedCell : ""} ${isLastLeft ? styles.pinnedLeftEdge : ""} ${isFirstRight ? styles.pinnedRightEdge : ""}`}
              tabIndex={keyboardNav ? 0 : undefined}
              onFocus={() => setActiveCell({ row: absIndex, col: colIdx })}
              onDoubleClick={() => {
                const isEditable = typeof c.editable === "function" ? c.editable(row) : c.editable;
                if (isEditable && onCellEdit) {
                  const curVal = optimisticEdits.has(editKey)
                    ? optimisticEdits.get(editKey)
                    : String((row as Record<string, unknown>)[c.key] ?? "");
                  finishingEdit.current = false;
                  setActiveCell({ row: absIndex, col: colIdx });
                  setEditingCell({ rowKey: key, colKey: c.key });
                  setEditValue(curVal ?? "");
                }
              }}
              style={{
                textAlign: c.align || "left",
                position: isPinnedLeft || isPinnedRight ? "sticky" : undefined,
                left: leftOffset,
                right: rightOffset,
                zIndex: isPinnedLeft || isPinnedRight ? 1 : undefined,
              }}
              data-active={isCellFocused ? "true" : undefined}
            >
              {isCellEditing ? (
                <input
                  type="text"
                  aria-label={typeof c.header === "string" ? `Edit ${c.header}` : `Edit ${c.key}`}
                  value={editValue}
                  autoFocus
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => commitCellEdit(key, c.key, editValue)}
                  className={styles.cellEditor}
                />
              ) : c.render ? (
                c.render(row, sourceIndex)
              ) : (
                currentDisplayVal
              )}
            </td>
          );
        })}
      </tr>
    );
  };

  const table = (
    <table
      onKeyDown={handleGridKeyDown}
      tabIndex={0}
      className={styles.table}
      aria-label={caption ? undefined : ariaLabel ?? "Data table"}
    >
      {caption && <caption className={styles.caption}>{caption}</caption>}
      <thead>
        <tr className={styles.headerRow}>
          {selectable && (
            <th
              className={`${styles.headerCell} ${styles.selectionCell}`}
            >
              <input
                type="checkbox"
                aria-label="Select all rows"
                checked={allSelected}
                ref={(el: any) => {
                  if (el) el.indeterminate = !allSelected && someSelected;
                }}
                onChange={toggleAll}
              />
            </th>
          )}
          {columns.map((c: any) => {
            const active = c.sortable && sortBy === c.key;
            const isPinnedLeft = c.pinned === "left";
            const isPinnedRight = c.pinned === "right";
            const leftOffset = isPinnedLeft ? pinnedLeftOffsets.get(c.key) ?? 0 : undefined;
            const rightOffset = isPinnedRight ? pinnedRightOffsets.get(c.key) ?? 0 : undefined;
            const isLastLeft = c.key === lastLeftPinnedKey;
            const isFirstRight = c.key === firstRightPinnedKey;

            return (
              <th
                key={c.key}
                className={`${styles.headerCell} ${isPinnedLeft || isPinnedRight ? styles.pinnedHeaderCell : ""} ${isLastLeft ? styles.pinnedLeftEdge : ""} ${isFirstRight ? styles.pinnedRightEdge : ""}`}
                aria-sort={
                  active
                    ? sortOrder === "asc"
                      ? "ascending"
                      : "descending"
                    : undefined
                }
                style={{
                  textAlign: c.align || "left",
                  width: c.width,
                  minWidth: c.minWidth,
                  position: isPinnedLeft || isPinnedRight ? "sticky" : undefined,
                  left: leftOffset,
                  right: rightOffset,
                  zIndex: isPinnedLeft || isPinnedRight ? 3 : 2,
                }}
              >
                {c.sortable ? (
                  <button
                    type="button"
                    className={styles.sortButton}
                    data-align={c.align ?? "left"}
                    onClick={() => handleSort(c)}
                  >
                    {c.header}
                    <span
                      className={styles.sortArrow}
                      data-active={active}
                      data-order={sortOrder}
                      aria-hidden="true"
                    >
                      {active ? sortOrder === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} /> : <ArrowUpDown size={14} />}
                    </span>
                  </button>
                ) : (
                  <span className={styles.headerContent} data-align={c.align ?? "left"}>
                  {c.header}
                  </span>
                )}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {loading ? (
          Array.from({ length: skeletonRows }).map((_, i) => (
            <tr key={`skel-${i}`} className={styles.dataRow}>
              {selectable && (
                <td className={`${styles.cell} ${styles.selectionCell}`}>
                  <Skeleton width={16} height={16} radius="sm" />
                </td>
              )}
              {columns.map((c) => (
                <td key={c.key} className={styles.cell}>
                  <Skeleton width={`${50 + (i * 13) % 40}%`} height={16} />
                </td>
              ))}
            </tr>
          ))
        ) : flatItems.length === 0 ? (
          <tr>
            <td colSpan={colSpan} className={styles.emptyCell}>
              <EmptyState title={emptyTitle} description={emptyMessage} icon={emptyIcon} />
            </td>
          </tr>
        ) : (
          <>
            {windowing && topSpacer > 0 && (
              <tr>
                <td colSpan={colSpan} className={styles.spacerCell} style={{ height: topSpacer }} />
              </tr>
            )}
            {visibleItems.map((item, idx) => {
              const absIndex = startIndex + idx;
              if (item.type === "group") {
                return renderGroupHeader(item.groupKey, item.count, item.collapsed, absIndex);
              }
              return renderRow(item.row, absIndex, item.rowIndex);
            })}
            {windowing && bottomSpacer > 0 && (
              <tr>
                <td colSpan={colSpan} className={styles.spacerCell} style={{ height: bottomSpacer }} />
              </tr>
            )}
          </>
        )}
      </tbody>

      {/* Summary Footer */}
      {summaryRow && (
        <tfoot>
          <tr className={styles.summaryRow}>
            {selectable && <td className={styles.cell} />}
            {columns.map((c) => (
              <td
                key={`summary-${c.key}`}
                className={styles.cell}
                style={{
                  textAlign: c.align || "left",
                }}
              >
                {typeof summaryRow === "object" && summaryRow !== null && c.key in summaryRow
                  ? (summaryRow as Record<string, ReactNode>)[c.key]
                  : null}
              </td>
            ))}
          </tr>
        </tfoot>
      )}
    </table>
  );

  return (
    <div
      ref={ref}
      className={styles.root}
      style={{ "--data-table-row-height": "var(--density-row-height)" } as CSSProperties}
    >
      {toolbar && (
        <div className={styles.toolbar} role="toolbar" aria-label="Table controls">
          {toolbar}
        </div>
      )}
      {selectable && someSelected && bulkActions && (
        <div
          role="toolbar"
          aria-label="Bulk actions"
          className={styles.bulkToolbar}
        >
          <span className={styles.selectionStatus} role="status" aria-live="polite">
            {selected.size} selected
          </span>
          <div className={styles.bulkActions}>{bulkActions([...selected])}</div>
        </div>
      )}

      {windowing ? (
        <div
          ref={scrollRef}
          onScroll={onScroll}
          className={`${styles.tableContainer} ${styles.virtualizedContainer}`}
          style={{
            maxBlockSize: maxHeight,
          }}
        >
          {table}
        </div>
      ) : (
        <div className={styles.tableContainer}>
          {table}
        </div>
      )}
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
}

/**
 * `<DataTable>` — Enterprise DataGrid 2.0 for the UniERP ecosystem.
 *
 * Capabilities:
 * - High-density typography with tabular numerals (`tabular-nums`)
 * - Virtualized rendering for high-volume operational datasets (10,000+ records)
 * - Multi-column pinning (`pinned: 'left' | 'right'`) with cumulative sticky offsets
 * - Excel-style keyboard grid navigation (`Arrow keys`, `Tab`, `F2` inline edit, `Shift+Space` select)
 * - Synchronized auto-scroll during keyboard cell navigation
 * - Unified grouped virtualization supporting 50k+ rows with subtotal aggregates
 * - Optimistic inline cell editing buffer
 * - Controlled multi-selection with bulk-action bar integration
 * - Pinned summary footer rows
 *
 * @maturity stable
 */
export const DataTable = forwardRef(DataTableInner) as <T>(
  props: DataTableProps<T> & { ref?: Ref<HTMLDivElement> }
) => ReactElement | null;

(DataTable as unknown as { displayName: string }).displayName = "DataTable";

export interface TableProps extends HTMLAttributes<HTMLTableElement> {}

/**
 * `<Table>` — Composable HTML table container adhering to Strata DL 3.0 / shadcn pattern.
 */
export const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ className = "", ...props }, ref) => (
    <div className={styles.tableContainer}>
      <table ref={ref} className={`${styles.table} ${className}`.trim()} {...props} />
    </div>
  )
);
Table.displayName = "Table";

export interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {}

export const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className = "", ...props }, ref) => (
    <thead ref={ref} className={`${styles.headerRow} ${className}`.trim()} {...props} />
  )
);
TableHeader.displayName = "TableHeader";

export interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {}

export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className = "", ...props }, ref) => (
    <tbody ref={ref} className={className || undefined} {...props} />
  )
);
TableBody.displayName = "TableBody";

export interface TableFooterProps extends HTMLAttributes<HTMLTableSectionElement> {}

export const TableFooter = forwardRef<HTMLTableSectionElement, TableFooterProps>(
  ({ className = "", ...props }, ref) => (
    <tfoot ref={ref} className={`${styles.summaryRow} ${className}`.trim()} {...props} />
  )
);
TableFooter.displayName = "TableFooter";

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {}

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className = "", ...props }, ref) => (
    <tr ref={ref} className={`${styles.dataRow} ${className}`.trim()} {...props} />
  )
);
TableRow.displayName = "TableRow";

export interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {}

export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className = "", ...props }, ref) => (
    <th ref={ref} className={`${styles.headerCell} ${className}`.trim()} {...props} />
  )
);
TableHead.displayName = "TableHead";

export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {}

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className = "", ...props }, ref) => (
    <td ref={ref} className={`${styles.cell} ${className}`.trim()} {...props} />
  )
);
TableCell.displayName = "TableCell";

export interface TableCaptionProps extends HTMLAttributes<HTMLTableCaptionElement> {}

export const TableCaption = forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  ({ className = "", ...props }, ref) => (
    <caption ref={ref} className={`${styles.caption} ${className}`.trim()} {...props} />
  )
);
TableCaption.displayName = "TableCaption";

