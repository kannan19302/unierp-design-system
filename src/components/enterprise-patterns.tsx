"use client";

import { type FC, type ReactNode } from "react";
import { Breadcrumb, type BreadcrumbItem } from "./extended-navigation";
import { Filter, Bookmark, CheckCircle2, Clock } from "lucide-react";
export { ChangeHistory, type ChangeHistoryProps } from "../data-grid/change-history";


// ── PageHeader ────────────────────────────────────────
export interface PageHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
  tabs?: ReactNode;
}

export const PageHeader: FC<PageHeaderProps> = ({ title, subtitle, description, breadcrumbs, actions, tabs }: any) => {
  const sub = subtitle ?? description;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-3)",
        marginBottom: "var(--space-4)",
        paddingBottom: tabs ? 0 : "var(--space-4)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "var(--space-4)" }}>
        <div>
          {breadcrumbs ? (
            <div style={{ fontSize: "var(--text-2xl)", fontWeight: 700, margin: 0 }}>
              <Breadcrumb items={breadcrumbs} />
            </div>
          ) : (
            <h1 style={{ fontSize: "var(--text-2xl)", fontWeight: 700, margin: 0, color: "var(--color-text)" }}>{title}</h1>
          )}
          {sub && <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", marginTop: "4px" }}>{sub}</div>}
        </div>
        {actions && <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>{actions}</div>}
      </div>
      {tabs && <div style={{ marginTop: "var(--space-2)" }}>{tabs}</div>}
    </div>
  );
};

// ── FilterBar & SavedViewSwitcher ─────────────────────
export interface FilterBarProps {
  children: ReactNode;
  onClearAll?: () => void;
}

export const FilterBar: FC<FilterBarProps> = ({ children, onClearAll }: any) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "var(--space-3)",
        padding: "var(--space-3)",
        background: "var(--color-bg-sunken)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-md)",
        marginBottom: "var(--space-4)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", color: "var(--color-text-secondary)", fontSize: "var(--text-xs)", fontWeight: 600 }}>
        <Filter size={14} />
        <span>Filters:</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "var(--space-2)", flex: 1 }}>{children}</div>
      {onClearAll && (
        <button
          onClick={onClearAll}
          style={{ background: "none", border: "none", color: "var(--color-primary)", fontSize: "var(--text-xs)", cursor: "pointer", fontWeight: 500 }}
        >
          Clear all
        </button>
      )}
    </div>
  );
};

export interface SavedView {
  id: string;
  name: string;
}

export interface SavedViewSwitcherProps {
  views: SavedView[];
  activeViewId: string;
  onSelectView: (id: string) => void;
}

export const SavedViewSwitcher: FC<SavedViewSwitcherProps> = ({ views, activeViewId, onSelectView }: any) => {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-1)" }}>
      <Bookmark size={14} style={{ color: "var(--color-text-muted)" }} />
      <select
        value={activeViewId}
        onChange={(e: any) => onSelectView(e.target.value)}
        style={{
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
          padding: "var(--space-1) var(--space-2)",
          fontSize: "var(--text-xs)",
          background: "var(--color-bg)",
        }}
      >
        {views.map((v: any) => (
          <option key={v.id} value={v.id}>
            {v.name}
          </option>
        ))}
      </select>
    </div>
  );
};

// ── BulkActionBar ─────────────────────────────────────
export interface BulkActionBarProps {
  selectedCount: number;
  actions: ReactNode;
}

export const BulkActionBar: FC<BulkActionBarProps> = ({ selectedCount, actions }: any) => {
  if (selectedCount <= 0) return null;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "var(--space-2-5) var(--space-4)",
        background: "var(--color-primary-light, rgba(59, 130, 246, 0.1))",
        border: "1px solid var(--color-primary)",
        borderRadius: "var(--radius-md)",
        marginBottom: "var(--space-3)",
      }}
    >
      <span style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-primary)" }}>
        {selectedCount} item{selectedCount > 1 ? "s" : ""} selected
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>{actions}</div>
    </div>
  );
};

// ── DetailLayout & RecordSidebar ──────────────────────
export interface DetailLayoutProps {
  header: ReactNode;
  main: ReactNode;
  sidebar?: ReactNode;
}

export const DetailLayout: FC<DetailLayoutProps> = ({ header, main, sidebar }: any) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      {header}
      <div style={{ display: "flex", gap: "var(--space-6)" }}>
        <div style={{ flex: 1, minWidth: 0 }}>{main}</div>
        {sidebar && <div style={{ width: "320px", flexShrink: 0 }}>{sidebar}</div>}
      </div>
    </div>
  );
};

export const RecordSidebar: FC<{ title?: ReactNode; children: ReactNode }> = ({ title = "Record Info", children }: any) => {
  return (
    <aside
      style={{
        background: "var(--color-bg-sunken)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-4)",
      }}
    >
      <h3 style={{ fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: "var(--space-3)", borderBottom: "1px solid var(--color-border)", paddingBottom: "var(--space-2)" }}>
        {title}
      </h3>
      {children}
    </aside>
  );
};

// ── ApprovalTimeline & AuditTrailPanel ────────────────
export interface ApprovalStep {
  id: string;
  approver: string;
  status: "approved" | "pending" | "rejected";
  timestamp?: string;
}

export const ApprovalTimeline: FC<{ steps: ApprovalStep[] }> = ({ steps }: any) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
      {steps.map((step: any) => (
        <div key={step.id} style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", fontSize: "var(--text-xs)" }}>
          {step.status === "approved" ? (
            <CheckCircle2 size={16} style={{ color: "var(--color-success)" }} />
          ) : (
            <Clock size={16} style={{ color: "var(--color-warning)" }} />
          )}
          <span style={{ fontWeight: 600 }}>{step.approver}</span>
          <span style={{ textTransform: "capitalize", color: "var(--color-text-secondary)" }}>{step.status}</span>
          {step.timestamp && <span style={{ color: "var(--color-text-muted)", marginLeft: "auto" }}>{step.timestamp}</span>}
        </div>
      ))}
    </div>
  );
};

export const AuditTrailPanel: FC<{ logs: { id: string; action: string; user: string; time: string }[] }> = ({ logs }: any) => {
  return (
    <div style={{ fontSize: "var(--text-xs)" }}>
      <h4 style={{ fontWeight: 600, marginBottom: "var(--space-2)" }}>Audit Trail</h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        {logs.map((log: any) => (
          <div key={log.id} style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: "var(--space-1)" }}>
            <span style={{ fontWeight: 600 }}>{log.user}</span> {log.action} <span style={{ color: "var(--color-text-muted)" }}>({log.time})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── PrintLayout ───────────────────────────────────────
export const PrintLayout: FC<{ children: ReactNode }> = ({ children }: any) => {
  return (
    <div className="print-layout-container" style={{ background: "#ffffff", color: "#000000", padding: "20px" }}>
      {children}
    </div>
  );
};

// ── useVirtualScroll — virtualized list rendering ─────
// B08: Only the visible window of rows is rendered — O(viewport) not O(list).
//   With 100 000 rows at 40px each = 4 000 000px total height;
//   startIndex = Math.floor(scrollTop / rowHeight) keeps DOM nodes constant.

import { useRef as _useRef, useState as _useState, useCallback as _useCallback, useEffect as _useEffect } from "react";

export interface VirtualScrollOptions {
  /** Total number of items in the list. */
  itemCount: number;
  /** Fixed row height in pixels. */
  rowHeight: number;
  /** Number of extra rows to render above/below the viewport (default 3). */
  overscan?: number;
}

export interface VirtualScrollResult {
  /** Ref to attach to the scroll container. */
  containerRef: React.RefObject<HTMLDivElement>;
  /** Total height of the virtual list (for the placeholder div). */
  totalHeight: number;
  /** First visible item index (inclusive). */
  startIndex: number;
  /** Last visible item index (exclusive). */
  endIndex: number;
  /** CSS transform to offset rendered items correctly. */
  offsetY: number;
  /** Scroll event handler to attach to the container. */
  onScroll: () => void;
}

export function useVirtualScroll({
  itemCount,
  rowHeight,
  overscan = 3,
}: VirtualScrollOptions): VirtualScrollResult {
  const containerRef = _useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = _useState(0);
  const [viewportHeight, setViewportHeight] = _useState(0);

  _useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]: any) => {
      if (entry) setViewportHeight(entry.contentRect.height);
    });
    ro.observe(el);
    setViewportHeight(el.clientHeight);
    return () => ro.disconnect();
  }, []);

  const onScroll = _useCallback(() => {
    setScrollTop(containerRef.current?.scrollTop ?? 0);
  }, []);

  const totalHeight = itemCount * rowHeight;
  const rawStart = Math.floor(scrollTop / rowHeight);
  const startIndex = Math.max(0, rawStart - overscan);
  const visibleCount = Math.ceil(viewportHeight / rowHeight);
  const endIndex = Math.min(itemCount, rawStart + visibleCount + overscan);
  const offsetY = startIndex * rowHeight;

  return { containerRef: containerRef as unknown as React.RefObject<HTMLDivElement>, totalHeight, startIndex, endIndex, offsetY, onScroll };
}

// ── DataTable — column-resizable table ───────────────
// B08: Each column header carries a drag handle that adjusts columnWidths state.
//   Uses mousedown+mousemove+mouseup cycle — no third-party library needed.

export interface DataTableColumn<T = Record<string, unknown>> {
  key: string;
  header: string;
  /** Default width in pixels. Default 150. */
  width?: number;
  /** Render function for each cell. */
  render?: (row: T, col: DataTableColumn<T>) => ReactNode;
}

export interface DataTableProps<T extends Record<string, unknown>> {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowKey?: (row: T) => string;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  rows,
  getRowKey,
}: DataTableProps<T>) {
  const [colWidths, setColWidths] = _useState<Record<string, number>>(() =>
    Object.fromEntries(columns.map((c: any) => [c.key, c.width ?? 150])),
  );
  const resizingRef = _useRef<{ key: string; startX: number; startW: number } | null>(null);

  const onResizeMouseDown = (e: React.MouseEvent, colKey: string) => {
    e.preventDefault();
    resizingRef.current = { key: colKey, startX: e.clientX, startW: colWidths[colKey] ?? 150 };

    const onMouseMove = (ev: MouseEvent) => {
      if (!resizingRef.current) return;
      const { key, startX, startW } = resizingRef.current;
      const newW = Math.max(60, startW + (ev.clientX - startX));
      setColWidths((prev: any) => ({ ...prev, [key]: newW }));
    };
    const onMouseUp = () => {
      resizingRef.current = null;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div style={{ overflowX: "auto", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
      <table
        role="grid"
        style={{ borderCollapse: "collapse", width: "max-content", fontSize: "var(--text-sm)" }}
      >
        <thead>
          <tr>
            {columns.map((col: any) => (
              <th
                key={col.key}
                scope="col"
                style={{
                  position: "relative",
                  width: colWidths[col.key],
                  padding: "var(--space-2) var(--space-3)",
                  background: "var(--color-bg-sunken)",
                  borderBottom: "1px solid var(--color-border)",
                  textAlign: "left",
                  fontWeight: 600,
                  userSelect: "none",
                  whiteSpace: "nowrap",
                }}
              >
                {col.header}
                {/* Column resize handle */}
                <div
                  aria-hidden="true"
                  onMouseDown={(e: any) => onResizeMouseDown(e, col.key)}
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: "4px",
                    cursor: "col-resize",
                    background: "transparent",
                  }}
                  title={`Resize ${col.header} column`}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row: any, rowIdx: any) => (
            <tr
              key={getRowKey ? getRowKey(row) : String(rowIdx)}
              style={{ borderBottom: "1px solid var(--color-border)" }}
            >
              {columns.map((col: any) => (
                <td
                  key={col.key}
                  style={{
                    padding: "var(--space-2) var(--space-3)",
                    width: colWidths[col.key],
                    maxWidth: colWidths[col.key],
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {col.render ? col.render(row, col) : String(row[col.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

