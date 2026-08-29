import type { Meta, StoryObj } from "@storybook/react";
import { MultiPageDashboard, type DashboardPage } from "./multi-page-dashboard";

const MOCK_PAGES: DashboardPage[] = [
  {
    id: "finance",
    title: "Financial Health",
    subtitle: "P&L, Accounts Receivable, Cash Flow",
    content: (
      <div style={{ padding: "var(--space-6)", background: "var(--color-surface-elevated)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border-default)" }}>
        <h3>Financial Summary Board</h3>
        <p style={{ color: "var(--color-text-secondary)" }}>
          Page 1 displays real-time cash position, revenue pacing, and burn rate.
        </p>
      </div>
    ),
  },
  {
    id: "supply-chain",
    title: "Supply Chain & Logistics",
    subtitle: "Warehouse capacity, pending purchase orders, supplier SLAs",
    content: (
      <div style={{ padding: "var(--space-6)", background: "var(--color-surface-elevated)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border-default)" }}>
        <h3>Inventory Logistics</h3>
        <p style={{ color: "var(--color-text-secondary)" }}>
          Page 2 tracks SKU throughput, backorders, and lead times.
        </p>
      </div>
    ),
  },
];

const meta: Meta<typeof MultiPageDashboard> = {
  title: "Dashboard/MultiPageDashboard",
  component: MultiPageDashboard,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof MultiPageDashboard>;

export const Default: Story = {
  args: {
    pages: MOCK_PAGES,
    defaultPageId: "finance",
  },
};
