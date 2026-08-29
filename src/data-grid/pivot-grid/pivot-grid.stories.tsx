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

const meta: Meta<typeof PivotGrid> = {
  title: "DataGrid/PivotGrid",
  component: PivotGrid,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof PivotGrid<SalesDatum>>;

export const RegionalRevenuePivot: Story = {
  args: {
    data: sampleData,
    rowDimension: "region",
    columnDimension: "quarter",
    metric: "revenue",
    aggregation: "sum",
    rowLabel: "Sales Region",
    columnLabel: "Fiscal Quarter",
    metricLabel: "Gross Revenue ($)",
    formatValue: (val) => `$${val.toLocaleString()}`,
  },
};
