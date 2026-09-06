import type { Meta, StoryObj } from "@storybook/react";
import { ExecutiveSummaryDashboard } from "./executive-summary-dashboard";

const meta: Meta<typeof ExecutiveSummaryDashboard> = {
  title: "Dashboard/ExecutiveSummaryDashboard",
  component: ExecutiveSummaryDashboard,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof ExecutiveSummaryDashboard>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 600, padding: "var(--space-4)" }}>
      <ExecutiveSummaryDashboard metrics={[{ label: 'Revenue', value: '$2.4M', change: 12 }, { label: 'Customers', value: '1,847', change: 8 }, { label: 'MRR', value: '$198K', change: -3 }, { label: 'NPS', value: '72', change: 5 }]} />
    </div>
  ),
};
