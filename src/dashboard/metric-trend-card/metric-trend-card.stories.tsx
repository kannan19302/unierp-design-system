import type { Meta, StoryObj } from "@storybook/react";
import { MetricTrendCard } from "./metric-trend-card";

const meta: Meta<typeof MetricTrendCard> = {
  title: "Dashboard/MetricTrendCard",
  component: MetricTrendCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    a11y: { test: "todo" },
  },
};

export default meta;
type Story = StoryObj<typeof MetricTrendCard>;

export const Default: Story = {
  render: () => (
    <div style={{ inlineSize: 420, paddingBlock: "var(--space-4)", paddingInline: "var(--space-4)" }}>
      <MetricTrendCard
        label="Monthly Recurring Revenue"
        value="$184,290"
        change={12.5}
        trend={[120, 135, 128, 145, 160, 155, 172, 184]}
      />
    </div>
  ),
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ inlineSize: 420, display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <MetricTrendCard
        label="Daily API Requests"
        value="4.2M"
        change={-3.1}
        trend={[5.1, 4.8, 4.6, 4.3, 4.2]}
        color="var(--color-error)"
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ inlineSize: 720, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
      <MetricTrendCard
        label="Active Subscriptions"
        value="1,492"
        change={4.8}
        trend={[1300, 1340, 1380, 1420, 1492]}
      />
      <MetricTrendCard
        label="Churn Rate"
        value="0.82%"
        change={-15.4}
        trend={[1.2, 1.1, 1.0, 0.9, 0.82]}
        color="var(--color-success)"
      />
      <MetricTrendCard
        label="No Trend Data"
        value="38 ms"
        change={0}
      />
      <MetricTrendCard
        label="Open Tickets"
        value="14"
        change={-22.0}
        trend={[32, 28, 22, 18, 14]}
      />
    </div>
  ),
};
