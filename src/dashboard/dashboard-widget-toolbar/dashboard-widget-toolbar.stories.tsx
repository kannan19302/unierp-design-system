import type { Meta, StoryObj } from "@storybook/react";
import { DashboardWidgetToolbar } from "./dashboard-widget-toolbar";

const meta: Meta<typeof DashboardWidgetToolbar> = {
  title: "Dashboard/DashboardWidgetToolbar",
  component: DashboardWidgetToolbar,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof DashboardWidgetToolbar>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 600, padding: "var(--space-4)" }}>
      <DashboardWidgetToolbar title="Revenue by Region" lastUpdated="2 min ago" onRefresh={() => {}} onExpand={() => {}} onExport={() => {}} onEdit={() => {}} />
    </div>
  ),
};
