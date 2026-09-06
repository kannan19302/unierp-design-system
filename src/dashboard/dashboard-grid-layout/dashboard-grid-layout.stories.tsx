import type { Meta, StoryObj } from "@storybook/react";
import { DashboardGridLayout } from "./dashboard-grid-layout";

const meta: Meta<typeof DashboardGridLayout> = {
  title: "Dashboard/DashboardGridLayout",
  component: DashboardGridLayout,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof DashboardGridLayout>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 600, padding: "var(--space-4)" }}>
      <DashboardGridLayout columns={3}><div style={{ height: 120, background: 'var(--color-bg-sunken)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)' }}>Widget A</div><div style={{ height: 120, background: 'var(--color-bg-sunken)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)' }}>Widget B</div><div style={{ height: 120, background: 'var(--color-bg-sunken)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)' }}>Widget C</div></DashboardGridLayout>
    </div>
  ),
};
