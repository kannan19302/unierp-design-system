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
  {
    id: "talent",
    title: "Headcount & People Ops",
    subtitle: "Staffing ratios, employee satisfaction, recruitment throughput",
    content: (
      <div style={{ padding: "var(--space-6)", background: "var(--color-surface-elevated)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border-default)" }}>
        <h3>HR Scorecard</h3>
        <p style={{ color: "var(--color-text-secondary)" }}>
          Page 3 summarizes active headcount, hiring pacing, and retention rates.
        </p>
      </div>
    ),
  },
];

const meta: Meta<typeof MultiPageDashboard> = {
  title: "Core/Dashboard/MultiPageDashboard",
  component: MultiPageDashboard,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    a11y: { test: "todo" },
  },
};

export default meta;
type Story = StoryObj<typeof MultiPageDashboard>;

export const Default: Story = {
  args: {
    pages: MOCK_PAGES,
    defaultPageId: "finance",
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ padding: "var(--space-4)" }}>
      <MultiPageDashboard
        pages={[
          {
            id: "overview",
            title: "Executive Pulse",
            content: <div>Single page briefing canvas.</div>,
          },
        ]}
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ padding: "var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", color: "var(--color-text-secondary)" }}>
          Multi-Tab Active Page (Page 2 selected)
        </h4>
        <MultiPageDashboard pages={MOCK_PAGES} defaultPageId="supply-chain" />
      </div>
    </div>
  ),
};
