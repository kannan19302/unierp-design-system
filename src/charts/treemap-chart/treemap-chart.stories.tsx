import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TreemapChart } from "./treemap-chart";

const SAMPLE_NODES = [
  { label: "Engineering", value: 450 },
  { label: "Sales & Marketing", value: 320 },
  { label: "Operations", value: 180 },
  { label: "Product", value: 120 },
  { label: "Customer Support", value: 90 },
];

const meta: Meta<typeof TreemapChart> = {
  title: "Charts/TreemapChart",
  component: TreemapChart,
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
  },
};

export default meta;
type Story = StoryObj<typeof TreemapChart>;

export const Default: Story = {
  render: (args) => (
    <div style={{ inlineSize: "500px", padding: "var(--space-4)" }}>
      <TreemapChart {...args} data={SAMPLE_NODES} />
    </div>
  ),
  args: {
    density: "standard",
    height: 300,
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ inlineSize: "550px", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <TreemapChart data={SAMPLE_NODES} height={260} />
    </div>
  ),
};

export const DensityGallery: Story = {
  render: () => (
    <div style={{ inlineSize: "550px", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Ultra-Compact Density (24px target)
        </h4>
        <TreemapChart data={SAMPLE_NODES.slice(0, 3)} height={160} density="ultra-compact" />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Compact Density (28px target)
        </h4>
        <TreemapChart data={SAMPLE_NODES.slice(0, 3)} height={180} density="compact" />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Standard Density (32px target)
        </h4>
        <TreemapChart data={SAMPLE_NODES} height={220} density="standard" />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Comfortable Density (40px target)
        </h4>
        <TreemapChart data={SAMPLE_NODES} height={280} density="comfortable" />
      </div>
    </div>
  ),
};
