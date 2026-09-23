import type { Meta, StoryObj } from "@storybook/react";
import { FinancialStatementViewer } from "./financial-statement-viewer";

const sampleRows = [
  { label: "Operating Revenue", values: [1200000, 1350000], isHeader: true },
  { label: "Product Subscriptions", values: [900000, 1050000], indent: 1 },
  { label: "Professional Services", values: [300000, 300000], indent: 1 },
  { label: "Cost of Goods Sold (COGS)", values: [-450000, -500000] },
  { label: "Gross Profit", values: [750000, 850000], isTotal: true },
  { label: "Operating Expenses (OPEX)", values: [-320000, -350000] },
  { label: "Net Operating Income", values: [430000, 500000], isTotal: true },
];

const meta: Meta<typeof FinancialStatementViewer> = {
  title: "Platforms/BusinessSuite/FinanceTreasury/FinancialStatementViewer",
  component: FinancialStatementViewer,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    a11y: { test: "todo" },
  },
};

export default meta;
type Story = StoryObj<typeof FinancialStatementViewer>;

export const Default: Story = {
  render: () => (
    <div style={{ inlineSize: 720, paddingBlock: "var(--space-4)", paddingInline: "var(--space-4)" }}>
      <FinancialStatementViewer
        title="Consolidated Income Statement"
        periods={["Q1 2026", "Q2 2026"]}
        rows={sampleRows}
      />
    </div>
  ),
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ inlineSize: 720, display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <FinancialStatementViewer
        title="Balance Sheet Snippet"
        periods={["Dec 31, 2025", "Mar 31, 2026"]}
        rows={[
          { label: "Current Assets", values: [4500000, 5200000], isHeader: true },
          { label: "Cash & Cash Equivalents", values: [3100000, 3700000], indent: 1 },
          { label: "Accounts Receivable", values: [1400000, 1500000], indent: 1 },
          { label: "Total Assets", values: [4500000, 5200000], isTotal: true },
        ]}
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ inlineSize: 720, display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", color: "var(--color-text-secondary)" }}>
          Multi-Period Comparison
        </h4>
        <FinancialStatementViewer
          title="Consolidated P&L"
          periods={["Q1", "Q2"]}
          rows={sampleRows}
        />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", color: "var(--color-text-secondary)" }}>
          Single Period Summary
        </h4>
        <FinancialStatementViewer
          title="Current Fiscal Month"
          periods={["March 2026"]}
          rows={[
            { label: "Total Bookings", values: [890000], isTotal: true },
            { label: "Direct Invoicing", values: [720000], indent: 1 },
          ]}
        />
      </div>
    </div>
  ),
};
