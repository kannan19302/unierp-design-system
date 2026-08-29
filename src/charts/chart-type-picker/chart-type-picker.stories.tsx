import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ChartTypePicker, type ChartType } from "./chart-type-picker";

const PickerDemo = () => {
  const [chartType, setChartType] = useState<ChartType>("donut");

  return (
    <div style={{ padding: "var(--space-6)", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <ChartTypePicker value={chartType} onChange={setChartType} />
      <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
        Active Chart Mode: <strong>{chartType.toUpperCase()}</strong>
      </div>
    </div>
  );
};

const meta: Meta<typeof ChartTypePicker> = {
  title: "Charts/ChartTypePicker",
  component: PickerDemo,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <PickerDemo />,
};
