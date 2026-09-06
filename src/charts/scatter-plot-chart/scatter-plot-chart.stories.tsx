import type { Meta, StoryObj } from "@storybook/react";
import { ScatterPlotChart } from "./scatter-plot-chart";

const meta: Meta<typeof ScatterPlotChart> = {
  title: "Charts/ScatterPlotChart",
  component: ScatterPlotChart,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof ScatterPlotChart>;

export const Default: Story = {
  render: () => {
    const data = Array.from({ length: 30 }, (_, i) => ({
    x: Math.round(Math.random() * 100),
    y: Math.round(Math.random() * 100),
    label: `Point ${i + 1}`,
  }));
    return (
      <div style={{ width: 500, padding: "var(--space-4)" }}>
        <ScatterPlotChart data={data} xLabel="Effort (hrs)" yLabel="Impact Score" />
      </div>
    );
  },
};
