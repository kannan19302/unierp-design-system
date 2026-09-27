import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ScatterChart } from "./scatter-chart";

const SAMPLE_POINTS = [
  { x: 10, y: 15, label: "Point 1" },
  { x: 20, y: 35, label: "Point 2" },
  { x: 35, y: 40, label: "Point 3" },
  { x: 50, y: 65, label: "Point 4" },
  { x: 65, y: 55, label: "Point 5" },
  { x: 80, y: 90, label: "Point 6" },
];

const meta: Meta<typeof ScatterChart> = {
  title: "Charts/ScatterChart",
  component: ScatterChart,
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
    xLabel: {
      control: "text",
    },
    yLabel: {
      control: "text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ScatterChart>;

export const Default: Story = {
  render: (args) => (
    <div style={{ inlineSize: "460px", padding: "var(--space-4)" }}>
      <ScatterChart {...args} data={SAMPLE_POINTS} />
    </div>
  ),
  args: {
    density: "standard",
    height: 280,
    xLabel: "Latency (ms)",
    yLabel: "Throughput (k req/s)",
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ inlineSize: "480px", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <ScatterChart
        data={SAMPLE_POINTS}
        xLabel="Latency (ms)"
        yLabel="Throughput (k req/s)"
      />
    </div>
  ),
};

export const DensityGallery: Story = {
  render: () => (
    <div style={{ inlineSize: "480px", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Ultra-Compact Density (24px target)
        </h4>
        <ScatterChart data={SAMPLE_POINTS.slice(0, 4)} height={180} density="ultra-compact" />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Compact Density (28px target)
        </h4>
        <ScatterChart data={SAMPLE_POINTS.slice(0, 4)} height={200} density="compact" />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Standard Density (32px target)
        </h4>
        <ScatterChart data={SAMPLE_POINTS} height={240} density="standard" />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Comfortable Density (40px target)
        </h4>
        <ScatterChart data={SAMPLE_POINTS} height={280} density="comfortable" />
      </div>
    </div>
  ),
};
