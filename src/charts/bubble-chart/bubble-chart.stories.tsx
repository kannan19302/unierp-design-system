import type { Meta, StoryObj } from "@storybook/react";
import { BubbleChart } from "./bubble-chart";

const meta: Meta<typeof BubbleChart> = {
  title: "Charts/BubbleChart",
  component: BubbleChart,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof BubbleChart>;

export const Default: Story = {
  render: () => {
    const data = [
    { x: 45, y: 78, size: 120, label: 'Product A' },
    { x: 72, y: 55, size: 80, label: 'Product B' },
    { x: 30, y: 90, size: 200, label: 'Product C' },
    { x: 85, y: 40, size: 60, label: 'Product D' },
    { x: 55, y: 65, size: 150, label: 'Product E' },
  ];
    return (
      <div style={{ width: 500, padding: "var(--space-4)" }}>
        <BubbleChart data={data} xLabel="Market Share (%)" yLabel="Growth Rate (%)" />
      </div>
    );
  },
};
