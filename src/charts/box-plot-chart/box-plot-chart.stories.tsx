import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { BoxPlotChart } from "./box-plot-chart";

const SAMPLE_DATA = [
  { label: "Q1", min: 20, q1: 35, median: 50, q3: 65, max: 80, outliers: [10, 92] },
  { label: "Q2", min: 25, q1: 40, median: 55, q3: 70, max: 85 },
  { label: "Q3", min: 30, q1: 45, median: 58, q3: 72, max: 90, outliers: [15] },
  { label: "Q4", min: 22, q1: 38, median: 52, q3: 68, max: 88 },
];

const meta: Meta<typeof BoxPlotChart> = {
  title: "Charts/BoxPlotChart",
  component: BoxPlotChart,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
    },
    height: {
      control: "number",
    },
    showOutliers: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof BoxPlotChart>;

export const Default: Story = {
  render: (args) => (
    <div style={{ inlineSize: "500px", padding: "var(--space-4)" }}>
      <BoxPlotChart {...args} data={SAMPLE_DATA} />
    </div>
  ),
  args: {
    density: "standard",
    height: 260,
    showOutliers: true,
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ inlineSize: "540px", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <BoxPlotChart data={SAMPLE_DATA} />
    </div>
  ),
};

export const DensityGallery: Story = {
  render: () => (
    <div style={{ inlineSize: "540px", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Ultra-Compact Density (24px target)
        </h4>
        <BoxPlotChart data={SAMPLE_DATA.slice(0, 3)} height={160} density="ultra-compact" />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Compact Density (28px target)
        </h4>
        <BoxPlotChart data={SAMPLE_DATA.slice(0, 3)} height={180} density="compact" />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Standard Density (32px target)
        </h4>
        <BoxPlotChart data={SAMPLE_DATA} height={220} density="standard" />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Comfortable Density (40px target)
        </h4>
        <BoxPlotChart data={SAMPLE_DATA} height={260} density="comfortable" />
      </div>
    </div>
  ),
};
