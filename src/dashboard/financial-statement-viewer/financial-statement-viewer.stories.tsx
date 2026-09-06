import type { Meta, StoryObj } from "@storybook/react";
import { FinancialStatementViewer } from "./financial-statement-viewer";

const meta: Meta<typeof FinancialStatementViewer> = {
  title: "Dashboard/FinancialStatementViewer",
  component: FinancialStatementViewer,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof FinancialStatementViewer>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 600, padding: "var(--space-4)" }}>
      <FinancialStatementViewer title="Income Statement" periods={['Q1 2026', 'Q2 2026']} rows={[{ label: 'Revenue', values: [1200000, 1350000], isHeader: true }, { label: 'Product Revenue', values: [900000, 1050000], indent: 1 }, { label: 'Services Revenue', values: [300000, 300000], indent: 1 }, { label: 'COGS', values: [-450000, -500000] }, { label: 'Gross Profit', values: [750000, 850000], isTotal: true }]} />
    </div>
  ),
};
