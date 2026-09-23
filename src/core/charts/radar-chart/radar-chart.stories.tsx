import type { Meta, StoryObj } from "@storybook/react";
import { RadarChart } from "./radar-chart";

const SAMPLE_AXES = ["Speed", "Reliability", "Comfort", "Safety", "Efficiency"];
const SAMPLE_DATASETS = [
  { label: "Model Alpha", values: [80, 90, 70, 85, 75], color: "var(--color-brand)" },
  { label: "Model Beta", values: [65, 75, 85, 90, 80], color: "var(--color-success)" },
];

const meta: Meta<typeof RadarChart> = {
  title: "Core/Charts/RadarChart",
  component: RadarChart,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    a11y: { test: "todo" },
  },
};

export default meta;
type Story = StoryObj<typeof RadarChart>;

export const Default: Story = {
  render: () => (
    <div style={{ inlineSize: "360px", padding: "var(--space-4)" }}>
      <RadarChart axes={SAMPLE_AXES} datasets={SAMPLE_DATASETS} />
    </div>
  ),
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ inlineSize: "380px", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <RadarChart axes={SAMPLE_AXES} datasets={SAMPLE_DATASETS} size={300} />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ inlineSize: "380px", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Dual Model Comparison
        </h4>
        <RadarChart axes={SAMPLE_AXES} datasets={SAMPLE_DATASETS} />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Single Dataset Focus
        </h4>
        <RadarChart axes={SAMPLE_AXES} datasets={[SAMPLE_DATASETS[0]]} />
      </div>
    </div>
  ),
};
