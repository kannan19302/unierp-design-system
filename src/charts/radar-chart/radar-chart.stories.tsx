import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { RadarChart } from "./radar-chart";

const SAMPLE_AXES = ["Speed", "Reliability", "Comfort", "Safety", "Efficiency"];
const SAMPLE_DATASETS = [
  { label: "Model Alpha", values: [80, 90, 70, 85, 75], color: "var(--color-brand)" },
  { label: "Model Beta", values: [65, 75, 85, 90, 80], color: "var(--color-success)" },
];

const meta: Meta<typeof RadarChart> = {
  title: "Charts/RadarChart",
  component: RadarChart,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
    },
    size: {
      control: "number",
    },
    showLabels: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof RadarChart>;

export const Default: Story = {
  render: (args) => (
    <div style={{ inlineSize: "360px", padding: "var(--space-4)" }}>
      <RadarChart {...args} axes={SAMPLE_AXES} datasets={SAMPLE_DATASETS} />
    </div>
  ),
  args: {
    density: "standard",
    size: 240,
    showLabels: true,
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ inlineSize: "380px", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <RadarChart axes={SAMPLE_AXES} datasets={SAMPLE_DATASETS} size={300} />
    </div>
  ),
};

export const DensityGallery: Story = {
  render: () => (
    <div style={{ inlineSize: "400px", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Ultra-Compact Density (24px target)
        </h4>
        <RadarChart axes={SAMPLE_AXES} datasets={SAMPLE_DATASETS} size={200} density="ultra-compact" />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Compact Density (28px target)
        </h4>
        <RadarChart axes={SAMPLE_AXES} datasets={SAMPLE_DATASETS} size={220} density="compact" />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Standard Density (32px target)
        </h4>
        <RadarChart axes={SAMPLE_AXES} datasets={SAMPLE_DATASETS} size={240} density="standard" />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Comfortable Density (40px target)
        </h4>
        <RadarChart axes={SAMPLE_AXES} datasets={SAMPLE_DATASETS} size={260} density="comfortable" />
      </div>
    </div>
  ),
};
