import type { Meta, StoryObj } from "@storybook/react";
import { PivotGrid } from "./pivot-grid";

interface SalesDatum {
  region: string;
  quarter: string;
  revenue: number;
}

const sampleData: SalesDatum[] = [
  { region: "North America", quarter: "Q1", revenue: 120000 },
  { region: "North America", quarter: "Q2", revenue: 145000 },
  { region: "North America", quarter: "Q3", revenue: 160000 },
  { region: "North America", quarter: "Q4", revenue: 210000 },
  { region: "Europe", quarter: "Q1", revenue: 95000 },
  { region: "Europe", quarter: "Q2", revenue: 110000 },
  { region: "Europe", quarter: "Q3", revenue: 125000 },
  { region: "Europe", quarter: "Q4", revenue: 170000 },
  { region: "Asia Pacific", quarter: "Q1", revenue: 80000 },
  { region: "Asia Pacific", quarter: "Q2", revenue: 105000 },
  { region: "Asia Pacific", quarter: "Q3", revenue: 140000 },
  { region: "Asia Pacific", quarter: "Q4", revenue: 195000 },
];

const defaultArgs = {
  data: sampleData,
  rowDimension: "region" as const,
  columnDimension: "quarter" as const,
  metric: "revenue" as const,
  aggregation: "sum" as const,
  rowLabel: "Sales Region",
  columnLabel: "Fiscal Quarter",
  metricLabel: "Gross Revenue ($)",
  formatValue: (val: number) => `$${val.toLocaleString()}`,
};

const meta: Meta<typeof PivotGrid> = {
  title: "Core/DataGrid/PivotGrid",
  component: PivotGrid,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PivotGrid<SalesDatum>>;

export const Default: Story = {
  args: defaultArgs,
};

export const RegionalRevenuePivot: Story = {
  args: defaultArgs,
};

export const AnatomyAndComposition: Story = {
  args: defaultArgs,
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div>
        <h4 style={{ marginBlockEnd: "0.5rem" }}>Sum Aggregation</h4>
        <PivotGrid {...defaultArgs} aggregation="sum" />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "0.5rem" }}>Average Aggregation</h4>
        <PivotGrid {...defaultArgs} aggregation="avg" />
      </div>
    </div>
  ),
};
