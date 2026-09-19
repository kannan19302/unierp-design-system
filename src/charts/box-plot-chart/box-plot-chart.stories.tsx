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
    a11y: { test: "todo" },
  },
};

export default meta;
type Story = StoryObj<typeof BoxPlotChart>;

export const Default: Story = {
  render: () => (
    <div style={{ inlineSize: "500px", padding: "var(--space-4)" }}>
      <BoxPlotChart data={SAMPLE_DATA} />
    </div>
  ),
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ inlineSize: "540px", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <BoxPlotChart data={SAMPLE_DATA} />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ inlineSize: "540px", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          With Outliers Displayed
        </h4>
        <BoxPlotChart data={SAMPLE_DATA} showOutliers={true} />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Without Outliers
        </h4>
        <BoxPlotChart data={SAMPLE_DATA} showOutliers={false} />
      </div>
    </div>
  ),
};
