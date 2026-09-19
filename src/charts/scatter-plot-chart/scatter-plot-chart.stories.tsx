import type { Meta, StoryObj } from "@storybook/react";
import { ScatterPlotChart } from "./scatter-plot-chart";

const SAMPLE_POINTS = [
  { x: 10, y: 15, label: "Point 1" },
  { x: 20, y: 35, label: "Point 2" },
  { x: 35, y: 40, label: "Point 3" },
  { x: 50, y: 65, label: "Point 4" },
  { x: 65, y: 55, label: "Point 5" },
  { x: 80, y: 90, label: "Point 6" },
];

const meta: Meta<typeof ScatterPlotChart> = {
  title: "Charts/ScatterPlotChart",
  component: ScatterPlotChart,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    a11y: { test: "todo" },
  },
};

export default meta;
type Story = StoryObj<typeof ScatterPlotChart>;

export const Default: Story = {
  render: () => (
    <div style={{ inlineSize: "460px", padding: "var(--space-4)" }}>
      <ScatterPlotChart data={SAMPLE_POINTS} />
    </div>
  ),
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ inlineSize: "480px", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <ScatterPlotChart
        data={SAMPLE_POINTS}
        xLabel="Latency (ms)"
        yLabel="Throughput (k req/s)"
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ inlineSize: "480px", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Linear Correlation
        </h4>
        <ScatterPlotChart data={SAMPLE_POINTS} />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Compact Dimensions
        </h4>
        <ScatterPlotChart data={SAMPLE_POINTS.slice(0, 4)} height={200} />
      </div>
    </div>
  ),
};
