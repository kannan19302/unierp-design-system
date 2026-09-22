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
    a11y: { test: "todo" },
  },
};

export default meta;
type Story = StoryObj<typeof TreemapChart>;

export const Default: Story = {
  render: () => (
    <div style={{ inlineSize: "500px", padding: "var(--space-4)" }}>
      <TreemapChart data={SAMPLE_NODES} />
    </div>
  ),
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ inlineSize: "550px", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <TreemapChart data={SAMPLE_NODES} height={260} />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ inlineSize: "550px", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Department Budget Allocation
        </h4>
        <TreemapChart data={SAMPLE_NODES} />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Compact Proportions
        </h4>
        <TreemapChart data={SAMPLE_NODES.slice(0, 3)} height={180} />
      </div>
    </div>
  ),
};
