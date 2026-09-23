import type { Meta, StoryObj } from "@storybook/react";
import { ExecutiveSummaryDashboard } from "./executive-summary-dashboard";

const sampleMetrics = [
  { label: "Consolidated ARR", value: "$18.4M", change: 24.5 },
  { label: "Net Revenue Retention", value: "119%", change: 3.2 },
  { label: "Enterprise Customers", value: "1,847", change: 8.4 },
  { label: "Operating Margin (GAAP)", value: "32.4%", change: -1.8 },
];

const meta: Meta<typeof ExecutiveSummaryDashboard> = {
  title: "Core/Dashboard/ExecutiveSummaryDashboard",
  component: ExecutiveSummaryDashboard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    a11y: { test: "todo" },
  },
};

export default meta;
type Story = StoryObj<typeof ExecutiveSummaryDashboard>;

export const Default: Story = {
  render: () => (
    <div style={{ inlineSize: 720, paddingBlock: "var(--space-4)", paddingInline: "var(--space-4)" }}>
      <ExecutiveSummaryDashboard metrics={sampleMetrics} />
    </div>
  ),
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ inlineSize: 720, display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <ExecutiveSummaryDashboard
        title="Treasury & Cash Equivalence"
        period="Fiscal 2026 Monthly Close"
        metrics={[
          { label: "Cash & Equivalents", value: "$45.2M", change: 12.0 },
          { label: "Days Sales Outstanding", value: "34 days", change: -5.2 },
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
          Full 4-Card Executive Grid
        </h4>
        <ExecutiveSummaryDashboard metrics={sampleMetrics} />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", color: "var(--color-text-secondary)" }}>
          Single Metric Pulse
        </h4>
        <ExecutiveSummaryDashboard
          title="Customer Satisfaction (CSAT)"
          period="Rolling 30 Days"
          metrics={[{ label: "Positive Sentiment Score", value: "98.2%", change: 1.4 }]}
        />
      </div>
    </div>
  ),
};
