import type { Meta, StoryObj } from "@storybook/react";
import { MetricTrendCard } from "./metric-trend-card";

const meta: Meta<typeof MetricTrendCard> = {
  title: "Dashboard/MetricTrendCard",
  component: MetricTrendCard,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof MetricTrendCard>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 600, padding: "var(--space-4)" }}>
      <MetricTrendCard label="Monthly Revenue" value="$184,290" change={12.5} trend={[120, 135, 128, 145, 160, 155, 172, 184]} />
    </div>
  ),
};
