import type { Meta, StoryObj } from "@storybook/react";
import { BoxPlotChart } from "./box-plot-chart";

const meta: Meta<typeof BoxPlotChart> = {
  title: "Charts/BoxPlotChart",
  component: BoxPlotChart,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof BoxPlotChart>;

export const Default: Story = {
  render: () => {
    const data = [
    { label: 'Q1', min: 20, q1: 35, median: 50, q3: 65, max: 80, outliers: [10, 92] },
    { label: 'Q2', min: 25, q1: 40, median: 55, q3: 70, max: 85 },
    { label: 'Q3', min: 30, q1: 45, median: 58, q3: 72, max: 90, outliers: [15] },
    { label: 'Q4', min: 22, q1: 38, median: 52, q3: 68, max: 88 },
  ];
    return (
      <div style={{ width: 500, padding: "var(--space-4)" }}>
        <BoxPlotChart data={data} />
      </div>
    );
  },
};
