import type { Meta, StoryObj } from "@storybook/react";
import { CrossFilterDashboard } from "./cross-filter-dashboard";

const meta: Meta<typeof CrossFilterDashboard> = {
  title: "Dashboard/CrossFilterDashboard",
  component: CrossFilterDashboard,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof CrossFilterDashboard>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 600, padding: "var(--space-4)" }}>
      <CrossFilterDashboard filters={[{ id: 'region', label: 'Region', options: ['North', 'South', 'East', 'West'] }, { id: 'quarter', label: 'Quarter', options: ['Q1', 'Q2', 'Q3', 'Q4'] }]}><div style={{ height: 200, background: 'var(--color-bg-sunken)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)' }}>Filtered Content Area</div></CrossFilterDashboard>
    </div>
  ),
};
