"use client";

import { type FC, type ReactNode } from "react";
import { Breadcrumb, type BreadcrumbItem } from "./extended-navigation";
import { Filter, Bookmark, CheckCircle2, Clock } from "lucide-react";

// ── PageHeader ────────────────────────────────────────
export interface PageHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
  tabs?: ReactNode;
}

export const PageHeader: FC<PageHeaderProps> = ({ title, subtitle, breadcrumbs, actions, tabs }) => {
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
      {breadcrumbs && <Breadcrumb items={breadcrumbs} />}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "var(--space-4)" }}>
        <div>
          <h1 style={{ fontSize: "var(--text-2xl)", fontWeight: 700, margin: 0, color: "var(--color-text)" }}>{title}</h1>
          {subtitle && <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", marginTop: "4px" }}>{subtitle}</div>}
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

export const FilterBar: FC<FilterBarProps> = ({ children, onClearAll }) => {
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

export const SavedViewSwitcher: FC<SavedViewSwitcherProps> = ({ views, activeViewId, onSelectView }) => {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-1)" }}>
      <Bookmark size={14} style={{ color: "var(--color-text-muted)" }} />
      <select
        value={activeViewId}
        onChange={(e) => onSelectView(e.target.value)}
        style={{
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
          padding: "var(--space-1) var(--space-2)",
          fontSize: "var(--text-xs)",
          background: "var(--color-bg)",
        }}
      >
        {views.map((v) => (
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

export const BulkActionBar: FC<BulkActionBarProps> = ({ selectedCount, actions }) => {
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

export const DetailLayout: FC<DetailLayoutProps> = ({ header, main, sidebar }) => {
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

export const RecordSidebar: FC<{ title?: ReactNode; children: ReactNode }> = ({ title = "Record Info", children }) => {
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

export const ApprovalTimeline: FC<{ steps: ApprovalStep[] }> = ({ steps }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
      {steps.map((step) => (
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

export const AuditTrailPanel: FC<{ logs: { id: string; action: string; user: string; time: string }[] }> = ({ logs }) => {
  return (
    <div style={{ fontSize: "var(--text-xs)" }}>
      <h4 style={{ fontWeight: 600, marginBottom: "var(--space-2)" }}>Audit Trail</h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        {logs.map((log) => (
          <div key={log.id} style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: "var(--space-1)" }}>
            <span style={{ fontWeight: 600 }}>{log.user}</span> {log.action} <span style={{ color: "var(--color-text-muted)" }}>({log.time})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── PrintLayout ───────────────────────────────────────
export const PrintLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="print-layout-container" style={{ background: "#ffffff", color: "#000000", padding: "20px" }}>
      {children}
    </div>
  );
};
