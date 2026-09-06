import type { Meta, StoryObj } from "@storybook/react";
import { RadarChart } from "./radar-chart";

const meta: Meta<typeof RadarChart> = {
  title: "Charts/RadarChart",
  component: RadarChart,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof RadarChart>;

export const Default: Story = {
  render: () => {
    const axes = ['Speed', 'Reliability', 'Cost', 'Support', 'Features'];
  const datasets = [
    { label: 'Product A', values: [80, 90, 60, 70, 85], color: '#2563eb' },
    { label: 'Product B', values: [65, 75, 90, 80, 60], color: '#10b981' },
  ];
    return (
      <div style={{ width: 500, padding: "var(--space-4)" }}>
        <RadarChart axes={axes} datasets={datasets} />
      </div>
    );
  },
};
