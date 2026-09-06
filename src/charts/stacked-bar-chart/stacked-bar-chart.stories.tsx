import type { Meta, StoryObj } from "@storybook/react";
import { StackedBarChart } from "./stacked-bar-chart";

const meta: Meta<typeof StackedBarChart> = {
  title: "Charts/StackedBarChart",
  component: StackedBarChart,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof StackedBarChart>;

export const Default: Story = {
  render: () => {
    const categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
  const series = [
    { label: 'Product A', values: [120, 150, 180, 140, 200], color: '#2563eb' },
    { label: 'Product B', values: [80, 90, 110, 100, 130], color: '#10b981' },
    { label: 'Product C', values: [40, 60, 50, 70, 55], color: '#f59e0b' },
  ];
    return (
      <div style={{ width: 500, padding: "var(--space-4)" }}>
        <StackedBarChart categories={categories} series={series} />
      </div>
    );
  },
};
