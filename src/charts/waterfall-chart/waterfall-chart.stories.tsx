import type { Meta, StoryObj } from "@storybook/react";
import { WaterfallChart } from "./waterfall-chart";

const meta: Meta<typeof WaterfallChart> = {
  title: "Charts/WaterfallChart",
  component: WaterfallChart,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof WaterfallChart>;

export const Default: Story = {
  render: () => {
    const sampleData = [
    { label: 'Revenue', value: 1200000 },
    { label: 'COGS', value: -450000 },
    { label: 'OpEx', value: -320000 },
    { label: 'Tax', value: -85000 },
    { label: 'Net Income', value: 345000, isTotal: true },
  ];
    return (
      <div style={{ width: 500, padding: "var(--space-4)" }}>
        <WaterfallChart data={sampleData} />
      </div>
    );
  },
};
