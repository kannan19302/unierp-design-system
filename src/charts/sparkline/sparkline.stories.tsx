import type { Meta, StoryObj } from "@storybook/react";
import { SparklineGrid } from "./sparkline";

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
  },
  argTypes: {
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
      description: "Strata 4-tier density scaling mode",
    },
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

export const DensityGallery: Story = {
  render: () => (
    <div style={{ inlineSize: "580px", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      {(["ultra-compact", "compact", "standard", "comfortable"] as const).map((density) => (
        <div key={density}>
          <h5 style={{ marginBlockEnd: "var(--space-2)", textTransform: "capitalize" }}>
            Density: {density}
          </h5>
          <SparklineGrid density={density} rows={SAMPLE_ROWS.slice(0, 2)} />
        </div>
      ))}
    </div>
  ),
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ inlineSize: "600px", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <h4>Sparkline Grid Anatomy</h4>
      <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)", margin: 0 }}>
        Dense tabular metric ledger pairing current numeric values with inline SVG trendlines and directional changes.
      </p>
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
        <h5 style={{ marginBlockEnd: "var(--space-2)" }}>Standard Telemetry Grid</h5>
        <SparklineGrid rows={SAMPLE_ROWS} />
      </div>
      <div>
        <h5 style={{ marginBlockEnd: "var(--space-2)" }}>Single Row Compact</h5>
        <SparklineGrid rows={[SAMPLE_ROWS[0]]} />
      </div>
    </div>
  ),
};
