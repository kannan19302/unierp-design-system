import type { Meta, StoryObj } from "@storybook/react";
import { VirtualizedTable, type VirtualizedColumn } from "./virtualized-table";

interface LedgerRecord {
  id: string;
  accountCode: string;
  accountName: string;
  department: string;
  debit: number;
  credit: number;
  currency: string;
  status: string;
}

const generateLedgerData = (count: number): LedgerRecord[] => {
  const depts = ["Finance", "Engineering", "Marketing", "Operations", "Sales", "HR"];
  const currencies = ["USD", "EUR", "GBP", "SGD", "JPY"];
  const statuses = ["POSTED", "RECONCILED", "PENDING_REVIEW"];

  return Array.from({ length: count }, (_, i) => ({
    id: `GL-2026-${String(i + 1).padStart(6, "0")}`,
    accountCode: `100${(i % 50) + 10}`,
    accountName: `Operating Expense Line #${i + 1}`,
    department: depts[i % depts.length],
    debit: i % 2 === 0 ? (i * 17.5) % 10000 : 0,
    credit: i % 2 === 1 ? (i * 19.2) % 10000 : 0,
    currency: currencies[i % currencies.length],
    status: statuses[i % statuses.length],
  }));
};

const columns: VirtualizedColumn<LedgerRecord>[] = [
  { key: "id", header: "Voucher #", width: 140, sortable: true, pinned: "left" },
  { key: "accountCode", header: "GL Code", width: 110, sortable: true },
  { key: "accountName", header: "Account Description", width: 220, sortable: true },
  { key: "department", header: "Department", width: 130, sortable: true },
  {
    key: "debit",
    header: "Debit Amount",
    width: 130,
    align: "right",
    sortable: true,
    render: (r) => (r.debit > 0 ? `$${r.debit.toFixed(2)}` : "-"),
  },
  {
    key: "credit",
    header: "Credit Amount",
    width: 130,
    align: "right",
    sortable: true,
    render: (r) => (r.credit > 0 ? `$${r.credit.toFixed(2)}` : "-"),
  },
  { key: "currency", header: "Curr", width: 80, align: "center" },
  {
    key: "status",
    header: "Status",
    width: 140,
    align: "center",
    render: (r) => (
      <span
        style={{
          paddingBlock: "2px",
          paddingInline: "8px",
          borderRadius: "var(--radius-full)",
          fontSize: "var(--text-xs)",
          fontWeight: 600,
          background:
            r.status === "POSTED"
              ? "var(--color-success-subtle, #ecfdf5)"
              : r.status === "RECONCILED"
              ? "var(--color-brand-subtle, #eff6ff)"
              : "var(--color-warning-subtle, #fffbeb)",
          color:
            r.status === "POSTED"
              ? "var(--color-success, #059669)"
              : r.status === "RECONCILED"
              ? "var(--color-brand, #2563eb)"
              : "var(--color-warning, #d97706)",
        }}
      >
        {r.status}
      </span>
    ),
  },
];

const meta: Meta<typeof VirtualizedTable> = {
  title: "Core/DataGrid/VirtualizedTable",
  component: VirtualizedTable,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof VirtualizedTable<LedgerRecord>>;

export const Default: Story = {
  render: () => {
    const data = generateLedgerData(500);
    return (
      <div style={{ maxInlineSize: 1100, marginInline: "auto" }}>
        <VirtualizedTable
          data={data}
          columns={columns}
          rowKey={(r) => r.id}
          viewportHeight={400}
          rowHeight={36}
          overscan={5}
        />
      </div>
    );
  },
};

export const AnatomyAndComposition: Story = {
  render: () => {
    const data = generateLedgerData(20);
    return (
      <div style={{ maxInlineSize: 1100, marginInline: "auto" }}>
        <VirtualizedTable
          data={data}
          columns={columns}
          rowKey={(r) => r.id}
          viewportHeight={300}
          rowHeight={36}
          overscan={3}
        />
      </div>
    );
  },
};

export const AllStatesGallery: Story = {
  render: () => {
    const data = generateLedgerData(50);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem", maxInlineSize: 1100, marginInline: "auto" }}>
        <div>
          <h4 style={{ marginBlockEnd: "0.5rem" }}>With Records</h4>
          <VirtualizedTable
            data={data}
            columns={columns}
            rowKey={(r) => r.id}
            viewportHeight={250}
            rowHeight={36}
          />
        </div>
        <div>
          <h4 style={{ marginBlockEnd: "0.5rem" }}>Empty State</h4>
          <VirtualizedTable
            data={[]}
            columns={columns}
            rowKey={(r) => r.id}
            viewportHeight={200}
            emptyMessage="No ledger records available"
          />
        </div>
      </div>
    );
  },
};

export const LargeLedgerDataset: Story = {
  render: () => {
    const data = generateLedgerData(5000);
    return (
      <div style={{ maxInlineSize: 1100, marginInline: "auto" }}>
        <h3 style={{ marginBlock: "0 var(--space-3)", fontSize: "var(--text-lg)" }}>
          General Ledger Journal (5,000 Virtualized Rows)
        </h3>
        <VirtualizedTable
          data={data}
          columns={columns}
          rowKey={(r) => r.id}
          viewportHeight={520}
          rowHeight={36}
          overscan={8}
        />
      </div>
    );
  },
};
