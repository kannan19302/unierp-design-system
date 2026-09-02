import type { Meta, StoryObj } from "@storybook/react";
import { DataWorkspace } from "./data-workspace";

interface InvoiceRow {
  id: string;
  customer: string;
  date: string;
  amount: string;
  status: string;
}

const SAMPLE_COLUMNS = [
  { key: "id", header: "Invoice #", width: "120px" },
  { key: "customer", header: "Customer Name" },
  { key: "date", header: "Issue Date", width: "120px" },
  { key: "amount", header: "Total Amount", width: "130px", align: "right" as const },
  { key: "status", header: "Status", width: "110px" },
];

const SAMPLE_DATA: InvoiceRow[] = [
  { id: "INV-2041", customer: "Apex Global Dynamics", date: "2026-09-01", amount: "$14,500.00", status: "Paid" },
  { id: "INV-2042", customer: "Nordic Logistics Oy", date: "2026-09-01", amount: "$8,320.50", status: "Pending" },
  { id: "INV-2043", customer: "Acme Industrial Corp", date: "2026-09-02", amount: "$32,180.00", status: "Awaiting approval" },
  { id: "INV-2044", customer: "Starlight Retail Ltd", date: "2026-09-02", amount: "$4,950.00", status: "Draft" },
  { id: "INV-2045", customer: "Vanguard Maritime", date: "2026-09-02", amount: "$19,750.00", status: "Overdue" },
];

const meta: Meta<typeof DataWorkspace> = {
  title: "Shell/Floorplans/DataWorkspace",
  component: DataWorkspace,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    action: { control: false },
    segments: { control: false },
    state: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof DataWorkspace>;

export const Default: Story = {
  args: {
    segments: [
      { label: "Acme Enterprise", href: "/" },
      { label: "Finance", href: "/finance" },
      { label: "Accounts Receivable", href: "/finance/ar" },
      { label: "Invoices" },
    ],
    state: { label: "1 Awaiting approval", tone: "warning" },
    action: { label: "Create Invoice", onClick: () => alert("Create new invoice") },
    title: "Invoices Ledger",
    subtitle: "High-volume transactional receivable ledger with synchronized density controls.",
    columns: SAMPLE_COLUMNS,
    data: SAMPLE_DATA,
    filters: [
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
    ],
    pagination: {
      page: 1,
      pageSize: 10,
      total: 48,
      onPageChange: (p) => console.log("page:", p),
    },
  },
};

export const Loading: Story = {
  args: {
    title: "Invoices Ledger",
    columns: SAMPLE_COLUMNS,
    data: [],
    loading: true,
  },
};

export const Empty: Story = {
  args: {
    title: "Invoices Ledger",
    columns: SAMPLE_COLUMNS,
    data: [],
    emptyTitle: "No invoices found",
    emptyDescription: "Create a new receivable invoice to get started.",
  },
};
