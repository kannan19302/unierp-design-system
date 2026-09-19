import type { Meta, StoryObj } from "@storybook/react";
import { SparklineGrid } from "./sparkline-grid";

const SAMPLE_ROWS = [
  { label: "Revenue", values: [100, 120, 115, 140, 160], current: "$160k", change: 14.2 },
  { label: "Expenses", values: [80, 85, 90, 88, 82], current: "$82k", change: -6.8 },
  { label: "Active Users", values: [1200, 1350, 1300, 1450, 1600], current: "1,600", change: 10.3 },
  { label: "Churn Rate", values: [2.5, 2.4, 2.2, 2.8, 3.1], current: "3.1%", change: -10.7 },
];

const meta: Meta<typeof SparklineGrid> = {
  title: "Charts/SparklineGrid",
  component: SparklineGrid,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    a11y: { test: "todo" },
  },
};

export default meta;
type Story = StoryObj<typeof SparklineGrid>;

export const Default: Story = {
  render: () => (
    <div style={{ inlineSize: "550px", padding: "var(--space-4)" }}>
      <SparklineGrid rows={SAMPLE_ROWS} />
    </div>
  ),
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ inlineSize: "600px", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <SparklineGrid
        rows={SAMPLE_ROWS}
        columns={["KPI Indicator", "30-Day Trend", "Current", "Delta"]}
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ inlineSize: "600px", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Standard Telemetry Grid
        </h4>
        <SparklineGrid rows={SAMPLE_ROWS} />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Single Row Compact
        </h4>
        <SparklineGrid rows={[SAMPLE_ROWS[0]]} />
      </div>
    </div>
  ),
};
