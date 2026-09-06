import type { Meta, StoryObj } from "@storybook/react";
import { TreemapChart } from "./treemap-chart";

const meta: Meta<typeof TreemapChart> = {
  title: "Charts/TreemapChart",
  component: TreemapChart,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof TreemapChart>;

export const Default: Story = {
  render: () => {
    const data = [
    { label: 'Engineering', value: 450000 },
    { label: 'Marketing', value: 280000 },
    { label: 'Sales', value: 320000 },
    { label: 'Support', value: 150000 },
    { label: 'HR', value: 95000 },
    { label: 'Legal', value: 75000 },
  ];
    return (
      <div style={{ width: 500, padding: "var(--space-4)" }}>
        <TreemapChart data={data} />
      </div>
    );
  },
};
