import type { Meta, StoryObj } from "@storybook/react";
import { DashboardChart } from "./dashboard-chart";

const MOCK_SALES_DATA = [
  { region: "North America", sales: 85000, target: 80000 },
  { region: "Europe", sales: 62000, target: 70000 },
  { region: "Asia Pacific", sales: 94000, target: 85000 },
  { region: "Latin America", sales: 38000, target: 40000 },
];

const meta: Meta<typeof DashboardChart> = {
  title: "Charts/DashboardChart",
  component: DashboardChart,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof DashboardChart>;

export const RegionalPerformance: Story = {
  args: {
    title: "Regional Sales Performance",
    subtitle: "Actual sales revenue compared to annual quota targets",
    data: MOCK_SALES_DATA,
    config: {
      xAxisKey: "region",
      series: [
        { dataKey: "sales", name: "Actual Sales", color: "#3b82f6" },
        { dataKey: "target", name: "Target Quota", color: "#94a3b8" },
      ],
    },
    defaultChartType: "bar",
    allowedChartTypes: ["bar", "stacked-bar", "line", "area", "composed"],
  },
};
