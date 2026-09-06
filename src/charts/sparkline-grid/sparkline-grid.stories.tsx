import type { Meta, StoryObj } from "@storybook/react";
import { SparklineGrid } from "./sparkline-grid";

const meta: Meta<typeof SparklineGrid> = {
  title: "Charts/SparklineGrid",
  component: SparklineGrid,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof SparklineGrid>;

export const Default: Story = {
  render: () => {
    const rows = [
    { label: 'Revenue', values: [120, 135, 128, 145, 160, 155, 172], current: '$172K', change: 11 },
    { label: 'Users', values: [5200, 5400, 5100, 5800, 6200, 6100, 6500], current: '6,500', change: 6.5 },
    { label: 'Churn Rate', values: [3.2, 2.8, 3.1, 2.5, 2.9, 3.0, 2.7], current: '2.7%', change: -10 },
    { label: 'NPS Score', values: [42, 45, 44, 48, 50, 52, 55], current: '55', change: 5.8 },
  ];
    return (
      <div style={{ width: 500, padding: "var(--space-4)" }}>
        <SparklineGrid rows={rows} />
      </div>
    );
  },
};
