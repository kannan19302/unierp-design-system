import type { Meta, StoryObj } from "@storybook/react";
import { BubbleChart } from "./bubble-chart";

const SAMPLE_BUBBLES = [
  { x: 10, y: 20, size: 30, label: "Project Alpha" },
  { x: 25, y: 50, size: 80, label: "Project Beta" },
  { x: 45, y: 35, size: 50, label: "Project Gamma" },
  { x: 70, y: 80, size: 120, label: "Project Delta" },
  { x: 85, y: 60, size: 65, label: "Project Epsilon" },
];

const meta: Meta<typeof BubbleChart> = {
  title: "Core/Charts/BubbleChart",
  component: BubbleChart,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    a11y: { test: "todo" },
  },
};

export default meta;
type Story = StoryObj<typeof BubbleChart>;

export const Default: Story = {
  render: () => (
    <div style={{ inlineSize: "460px", padding: "var(--space-4)" }}>
      <BubbleChart data={SAMPLE_BUBBLES} />
    </div>
  ),
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ inlineSize: "480px", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <BubbleChart
        data={SAMPLE_BUBBLES}
        xLabel="Investment ($k)"
        yLabel="Return on Capital (%)"
        sizeLabel="Market Cap ($M)"
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ inlineSize: "480px", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Standard Distribution
        </h4>
        <BubbleChart data={SAMPLE_BUBBLES} />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Compact Dimensions
        </h4>
        <BubbleChart data={SAMPLE_BUBBLES.slice(0, 3)} height={220} />
      </div>
    </div>
  ),
};
