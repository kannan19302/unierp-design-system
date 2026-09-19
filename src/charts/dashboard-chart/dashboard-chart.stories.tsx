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
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    a11y: { test: "todo" },
  },
};

export default meta;
type Story = StoryObj<typeof DashboardChart>;

export const Default: Story = {
  args: {
    title: "Regional Sales Performance",
    subtitle: "Actual sales revenue compared to annual quota targets",
    data: MOCK_SALES_DATA,
    config: {
      xAxisKey: "region",
      series: [
        { dataKey: "sales", name: "Actual Sales", color: "var(--color-brand)" },
        { dataKey: "target", name: "Target Quota", color: "var(--color-text-tertiary)" },
      ],
    },
    defaultChartType: "bar",
    allowedChartTypes: ["bar", "stacked-bar", "line", "area", "composed"],
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ inlineSize: "680px", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <DashboardChart
        title="Regional Sales Performance"
        subtitle="Actual sales revenue compared to annual quota targets"
        data={MOCK_SALES_DATA}
        config={{
          xAxisKey: "region",
          series: [
            { dataKey: "sales", name: "Actual Sales", color: "var(--color-brand)" },
            { dataKey: "target", name: "Target Quota", color: "var(--color-text-tertiary)" },
          ],
        }}
        defaultChartType="bar"
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ inlineSize: "680px", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <DashboardChart
        title="Loading State"
        data={[]}
        config={{ series: [] }}
        loading={true}
      />
      <DashboardChart
        title="Empty Dataset State"
        data={[]}
        config={{ series: [] }}
      />
      <DashboardChart
        title="Composed Line & Bar View"
        data={MOCK_SALES_DATA}
        config={{
          xAxisKey: "region",
          series: [
            { dataKey: "sales", name: "Actual Sales", type: "bar", color: "var(--color-brand)" },
            { dataKey: "target", name: "Target Quota", type: "line", color: "var(--color-warning)" },
          ],
        }}
        defaultChartType="composed"
      />
    </div>
  ),
};
