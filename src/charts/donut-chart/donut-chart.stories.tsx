import type { Meta, StoryObj } from "@storybook/react";
import { DonutChart } from "./donut-chart";

const meta: Meta<typeof DonutChart> = {
  title: "Charts/DonutChart",
  component: DonutChart,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DonutChart>;

export const Default: Story = {
  args: {
    centerValue: "100%",
    centerLabel: "Total",
  },
};
