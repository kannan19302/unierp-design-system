import React, { useState, useMemo } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Download,
  RotateCw,
  SlidersHorizontal,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  FileCheck,
  Send,
  Trash2,
  Sparkles,
} from "lucide-react";
import { DataWorkspace, type DataWorkspaceColumn, type DataWorkspaceFilter } from "./data-shell";

interface TransactionRow {
  id: string;
  customer: string;
  customerTier: "Enterprise" | "Mid-Market" | "Growth";
  type: "Invoice" | "Credit Note" | "Retainer" | "Recurring";
  date: string;
  dueDate: string;
  amount: number;
  currency: string;
  status: "Paid" | "Pending" | "Awaiting approval" | "Draft" | "Overdue";
}

const SAMPLE_DATA: TransactionRow[] = [
  {
    id: "INV-2041",
    customer: "Apex Global Dynamics",
    customerTier: "Enterprise",
    type: "Invoice",
    date: "2026-09-01",
    dueDate: "2026-09-15",
    amount: 14500.0,
    currency: "USD",
    status: "Paid",
  },
  {
    id: "INV-2042",
    customer: "Nordic Logistics Oy",
    customerTier: "Enterprise",
    type: "Recurring",
    date: "2026-09-01",
    dueDate: "2026-09-20",
    amount: 8320.5,
    currency: "EUR",
    status: "Pending",
  },
  {
    id: "INV-2043",
    customer: "Acme Industrial Corp",
    customerTier: "Enterprise",
    type: "Invoice",
    date: "2026-09-02",
    dueDate: "2026-09-16",
    amount: 32180.0,
    currency: "USD",
    status: "Awaiting approval",
  },
  {
    id: "INV-2044",
    customer: "Starlight Retail Ltd",
    customerTier: "Mid-Market",
    type: "Retainer",
    date: "2026-09-02",
    dueDate: "2026-09-30",
    amount: 4950.0,
    currency: "GBP",
    status: "Draft",
  },
  {
    id: "INV-2045",
    customer: "Vanguard Maritime",
    customerTier: "Enterprise",
    type: "Invoice",
    date: "2026-09-02",
    dueDate: "2026-09-05",
    amount: 19750.0,
    currency: "USD",
    status: "Overdue",
  },
  {
    id: "CRN-1012",
    customer: "Helios Solar Energy",
    customerTier: "Growth",
    type: "Credit Note",
    date: "2026-09-03",
    dueDate: "2026-09-17",
    amount: -1250.0,
    currency: "EUR",
    status: "Paid",
  },
  {
    id: "INV-2046",
    customer: "Meridian BioTech Labs",
    customerTier: "Enterprise",
    type: "Invoice",
    date: "2026-09-03",
    dueDate: "2026-09-25",
    amount: 48900.0,
    currency: "USD",
    status: "Awaiting approval",
  },
  {
    id: "INV-2047",
    customer: "Zenith Cloud Architecture",
    customerTier: "Mid-Market",
    type: "Recurring",
    date: "2026-09-04",
    dueDate: "2026-09-28",
    amount: 11200.0,
    currency: "USD",
    status: "Pending",
  },
];

const STATUS_CONFIG: Record<
  TransactionRow["status"],
  { bg: string; color: string; border: string; icon: React.ReactNode }
> = {
  Paid: {
    bg: "rgba(16, 185, 129, 0.1)",
    color: "#059669",
    border: "rgba(16, 185, 129, 0.25)",
    icon: <CheckCircle2 size={12} />,
  },
  Pending: {
    bg: "rgba(245, 158, 11, 0.1)",
    color: "#d97706",
    border: "rgba(245, 158, 11, 0.25)",
    icon: <Clock size={12} />,
  },
  "Awaiting approval": {
    bg: "rgba(139, 92, 246, 0.1)",
    color: "#7c3aed",
    border: "rgba(139, 92, 246, 0.25)",
    icon: <Sparkles size={12} />,
  },
  Draft: {
    bg: "rgba(148, 163, 184, 0.12)",
    color: "#64748b",
    border: "rgba(148, 163, 184, 0.3)",
    icon: <FileText size={12} />,
  },
  Overdue: {
    bg: "rgba(239, 68, 68, 0.1)",
    color: "#dc2626",
    border: "rgba(239, 68, 68, 0.25)",
    icon: <AlertTriangle size={12} />,
  },
};

const SAMPLE_COLUMNS: DataWorkspaceColumn<TransactionRow>[] = [
  {
    key: "id",
    header: "Transaction #",
    width: "140px",
    sortable: true,
    render: (val) => (
      <span style={{ fontWeight: 600, fontFamily: "var(--font-mono, monospace)", color: "var(--color-primary)" }}>
        {String(val)}
      </span>
    ),
  },
  {
    key: "customer",
    header: "Counterparty / Account",
    sortable: true,
    render: (val, row) => (
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        <span style={{ fontWeight: 500, color: "var(--color-text)" }}>{String(val)}</span>
        <span style={{ fontSize: "var(--text-2xs, 10px)", color: "var(--color-text-secondary)" }}>
          {row.customerTier} Account • {row.type}
        </span>
      </div>
    ),
  },
  {
    key: "date",
    header: "Issue Date",
    width: "120px",
    sortable: true,
    render: (val) => <span style={{ color: "var(--color-text-secondary)" }}>{String(val)}</span>,
  },
  {
    key: "dueDate",
    header: "Due Date",
    width: "120px",
    sortable: true,
    render: (val) => <span style={{ color: "var(--color-text-secondary)" }}>{String(val)}</span>,
  },
  {
    key: "amount",
    header: "Total Value",
    width: "140px",
    align: "right",
    sortable: true,
    render: (val, row) => {
      const num = Number(val);
      const isNegative = num < 0;
      return (
        <span
          style={{
            fontWeight: 600,
            fontVariantNumeric: "tabular-nums",
            color: isNegative ? "#dc2626" : "var(--color-text)",
          }}
        >
          {row.currency} {Math.abs(num).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          {isNegative && " CR"}
        </span>
      );
    },
  },
  {
    key: "status",
    header: "Settlement Status",
    width: "170px",
    sortable: true,
    render: (val) => {
      const cfg = STATUS_CONFIG[val as TransactionRow["status"]] || STATUS_CONFIG.Draft;
      return (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            padding: "2px 8px",
            borderRadius: "var(--radius-full, 9999px)",
            backgroundColor: cfg.bg,
            color: cfg.color,
            border: `1px solid ${cfg.border}`,
            fontSize: "var(--text-xs, 11px)",
            fontWeight: 600,
          }}
        >
          {cfg.icon}
          {String(val)}
        </span>
      );
    },
  },
];

const SAMPLE_FILTERS: DataWorkspaceFilter[] = [
  {
    key: "status",
    label: "Status",
    options: [
      { label: "Paid", value: "Paid" },
      { label: "Pending", value: "Pending" },
      { label: "Awaiting approval", value: "Awaiting approval" },
      { label: "Draft", value: "Draft" },
      { label: "Overdue", value: "Overdue" },
    ],
  },
  {
    key: "type",
    label: "Document Type",
    options: [
      { label: "Invoice", value: "Invoice" },
      { label: "Credit Note", value: "Credit Note" },
      { label: "Retainer", value: "Retainer" },
      { label: "Recurring", value: "Recurring" },
    ],
  },
];

const meta: Meta<typeof DataWorkspace> = {
  title: "Core/Shell/DataWorkspace",
  component: DataWorkspace,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    a11y: {
      element: "#storybook-root",
      config: {
        rules: [{ id: "color-contrast", enabled: true }],
      },
    },
  },
  argTypes: {
    action: { control: false },
    segments: { control: false },
    state: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof DataWorkspace>;

/**
 * 1. Default Flagship Interactive Data Workspace
 * Demonstrates high-density transaction ledger with live sorting, multi-filtering,
 * selectable rows, synchronized pagination, search shortcuts, and density modes.
 */
function InteractiveLedgerWorkbench() {
  const [density, setDensity] = useState<"ultra-compact" | "compact" | "standard" | "comfortable">("standard");
  const [selectedKeys, setSelectedKeys] = useState<Array<string | number>>([]);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const handleBatchApprove = () => {
    alert(`Batch approved ${selectedKeys.length} selected record(s).`);
  };

  const handleExportSelected = () => {
    alert(`Exporting ${selectedKeys.length} record(s) to CSV/Excel.`);
  };

  return (
    <div style={{ padding: "var(--space-6, 24px)", maxWidth: "1400px", margin: "0 auto" }}>
      <DataWorkspace<TransactionRow>
        segments={[
          { label: "UniERP Enterprise", href: "/" },
          { label: "Financial Suite", href: "/finance" },
          { label: "Accounts Receivable", href: "/finance/ar" },
          { label: "Receivables Ledger" },
        ]}
        state={{ label: "2 Awaiting Approval", tone: "warning" }}
        action={{
          label: "Create Transaction",
          onClick: () => alert("Initiate new transaction flow"),
        }}
        title="Receivables & Invoices Ledger"
        subtitle="Synthetic multi-currency ledger example with four density controls."
        columns={SAMPLE_COLUMNS}
        data={SAMPLE_DATA}
        density={density}
        selectable
        selectedRowKeys={selectedKeys}
        onSelectionChange={(keys) => setSelectedKeys(keys)}
        filters={SAMPLE_FILTERS}
        activeFilters={activeFilters}
        onFilterChange={setActiveFilters}
        searchable
        searchPlaceholder="Filter by invoice #, counterparty, status... (Press / to search)"
        toolbarActions={
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            {/* Density Selector */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border)",
                background: "var(--color-bg-elevated)",
                padding: "2px",
              }}
            >
              {(["ultra-compact", "compact", "standard", "comfortable"] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDensity(d)}
                  style={{
                    padding: "3px 8px",
                    border: "none",
                    borderRadius: "var(--radius-sm)",
                    background: density === d ? "var(--color-primary)" : "transparent",
                    color: density === d ? "white" : "var(--color-text-secondary)",
                    fontSize: "var(--text-2xs, 10px)",
                    fontWeight: 600,
                    textTransform: "capitalize",
                    cursor: "pointer",
                    transition: "all var(--duration-fast)",
                  }}
                >
                  {d}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => alert("Refreshed transaction queue")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "5px 10px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border)",
                background: "var(--color-bg-elevated)",
                color: "var(--color-text)",
                fontSize: "var(--text-xs)",
                fontWeight: 500,
                cursor: "pointer",
              }}
              aria-label="Refresh transactions"
            >
              <RotateCw size={13} />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              onClick={() => alert("Exporting all records")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "5px 10px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border)",
                background: "var(--color-bg-elevated)",
                color: "var(--color-text)",
                fontSize: "var(--text-xs)",
                fontWeight: 500,
                cursor: "pointer",
              }}
              aria-label="Export CSV"
            >
              <Download size={13} />
              <span>Export</span>
            </button>
          </div>
        }
        bulkActions={
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            <button
              type="button"
              onClick={handleBatchApprove}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "4px 10px",
                borderRadius: "var(--radius-md)",
                background: "var(--color-primary)",
                color: "white",
                border: "none",
                fontSize: "var(--text-xs)",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <FileCheck size={13} />
              Batch Approve
            </button>
            <button
              type="button"
              onClick={handleExportSelected}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "4px 10px",
                borderRadius: "var(--radius-md)",
                background: "var(--color-bg-elevated)",
                color: "var(--color-text)",
                border: "1px solid var(--color-border)",
                fontSize: "var(--text-xs)",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              <Download size={13} />
              Export
            </button>
          </div>
        }
        pagination={{
          page,
          pageSize,
          total: SAMPLE_DATA.length,
          onPageChange: (p) => setPage(p),
        }}
      />
    </div>
  );
}

export const Default: Story = {
  name: "V1 enterprise benchmark",
  render: () => <InteractiveLedgerWorkbench />,
};

/**
 * 2. Complete Enterprise State Matrix
 */
export const StateMatrix: Story = {
  name: "State matrix: populated, loading, empty, bulk selection",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-10, 40px)", padding: "var(--space-6, 24px)" }}>
      {/* 1. Populated with Bulk Selection Active */}
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", color: "var(--color-text-secondary)" }}>
          1. Populated State with Bulk Actions Activated
        </h4>
        <DataWorkspace<TransactionRow>
          title="Receivables Ledger (3 Selected)"
          columns={SAMPLE_COLUMNS}
          data={SAMPLE_DATA}
          selectable
          selectedRowKeys={["INV-2041", "INV-2043", "INV-2045"]}
          selectedCount={3}
          bulkActions={
            <div style={{ display: "flex", gap: "var(--space-2)" }}>
              <button
                type="button"
                style={{
                  padding: "4px 10px",
                  borderRadius: "var(--radius-md)",
                  background: "var(--color-primary)",
                  color: "white",
                  border: "none",
                  fontSize: "var(--text-xs)",
                  fontWeight: 600,
                }}
              >
                Batch Approve (3)
              </button>
            </div>
          }
          pagination={{
            page: 1,
            pageSize: 5,
            total: 8,
            onPageChange: () => {},
          }}
        />
      </div>

      {/* 2. Loading Skeleton State */}
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", color: "var(--color-text-secondary)" }}>
          2. Loading Skeleton State
        </h4>
        <DataWorkspace
          title="Receivables Ledger"
          columns={SAMPLE_COLUMNS}
          data={[]}
          loading={true}
          selectable
        />
      </div>

      {/* 3. Empty State with CTA */}
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", color: "var(--color-text-secondary)" }}>
          3. Empty State (Zero Search Results)
        </h4>
        <DataWorkspace
          title="Receivables Ledger"
          columns={SAMPLE_COLUMNS}
          data={[]}
          emptyTitle="No transactions match your search"
          emptyDescription="Try clearing your active filters or expanding the date range."
          filters={SAMPLE_FILTERS}
          activeFilters={{ status: "Overdue" }}
        />
      </div>
    </div>
  ),
};

/**
 * 3. Density Modes Comparison
 */
export const DensityModes: Story = {
  name: "Density comparison: compact vs comfortable",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8, 32px)", padding: "var(--space-6, 24px)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", color: "var(--color-text-secondary)" }}>
          High-Density Compact Mode (28px Row Height)
        </h4>
        <DataWorkspace<TransactionRow>
          density="compact"
          title="Compact High-Throughput Ledger"
          columns={SAMPLE_COLUMNS}
          data={SAMPLE_DATA.slice(0, 4)}
          selectable
        />
      </div>

      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", color: "var(--color-text-secondary)" }}>
          Comfortable Spaced Mode (48px Row Height)
        </h4>
        <DataWorkspace<TransactionRow>
          density="comfortable"
          title="Executive Review Ledger"
          columns={SAMPLE_COLUMNS}
          data={SAMPLE_DATA.slice(0, 4)}
          selectable
        />
      </div>
    </div>
  ),
};

/**
 * 4. Right-To-Left (RTL) Symmetry Preview
 */
export const RtlPreview: Story = {
  name: "RTL bidirectional layout",
  render: () => (
    <div dir="rtl" style={{ padding: "var(--space-6, 24px)", maxWidth: "1400px", margin: "0 auto" }}>
      <DataWorkspace<TransactionRow>
        segments={[
          { label: "مؤسسة يوني إي آر بي", href: "/" },
          { label: "المالية", href: "/finance" },
          { label: "دفتر الأستاذ للحسابات المدينة" },
        ]}
        state={{ label: "بانتظار الموافقة", tone: "warning" }}
        action={{
          label: "إنشاء معاملة جديدة",
          onClick: () => {},
        }}
        title="دفتر الأستاذ والحركات المالية"
        subtitle="نظام تتبع المعاملات المالية متعدد العملات والمطابق لمعايير الحوكمة والتدقيق."
        columns={SAMPLE_COLUMNS}
        data={SAMPLE_DATA.slice(0, 5)}
        selectable
        searchPlaceholder="البحث في المعاملات والحسابات..."
        pagination={{
          page: 1,
          pageSize: 5,
          total: 8,
          onPageChange: () => {},
        }}
      />
    </div>
  ),
};
