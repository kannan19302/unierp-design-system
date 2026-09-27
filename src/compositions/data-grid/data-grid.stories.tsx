import type { Meta, StoryObj } from "@storybook/react";
import { SpreadsheetGrid, DataGrid } from "./data-grid";

const mockBudgetColumns = ["Account Code", "Description", "Q1 FY26", "Q2 FY26", "Q3 FY26", "Q4 FY26", "Total FY26"];

const mockBudgetData = [
  ["4010-REV", "Software Subscriptions", "450,000", "480,000", "510,000", "550,000", "1,990,000"],
  ["4020-REV", "Professional Services", "120,000", "115,000", "130,000", "140,000", "505,000"],
  ["5010-EXP", "Cloud Infrastructure Hosting", "-85,000", "-92,000", "-98,000", "-105,000", "-380,000"],
  ["5020-EXP", "Personnel & Payroll Costs", "-210,000", "-215,000", "-225,000", "-230,000", "-880,000"],
  ["5030-EXP", "Sales & Marketing Campaigns", "-65,000", "-70,000", "-75,000", "-80,000", "-290,000"],
  ["9000-NET", "Operating Income (EBITDA)", "210,000", "218,000", "242,000", "275,000", "945,000"],
];

const meta: Meta<typeof SpreadsheetGrid> = {
  title: "Compositions/SpreadsheetGrid",
  component: SpreadsheetGrid,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
      description: "Strata 4-tier density scaling for high-throughput data entry.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible ARIA label for screen readers navigating the grid.",
    },
    rowCount: {
      control: "number",
      description: "Fallback row count if initialData is not supplied.",
    },
    colCount: {
      control: "number",
      description: "Fallback column count if columns is not supplied.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof SpreadsheetGrid>;

export const BudgetForecasting: Story = {
  args: {
    columns: mockBudgetColumns,
    initialData: mockBudgetData,
    density: "compact",
  },
};

export const AnatomyAndComposition: Story = {
  args: {
    ...BudgetForecasting.args,
  },
};

export const DensityGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)" }}>Ultra-Compact (24px cells)</h4>
        <DataGrid
          columns={["Code", "Item", "Q1", "Q2", "Q3", "Q4"]}
          initialData={[
            ["A1", "Item One", "10", "20", "30", "40"],
            ["A2", "Item Two", "15", "25", "35", "45"],
          ]}
          density="ultra-compact"
        />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)" }}>Compact (28px cells)</h4>
        <DataGrid
          columns={["Code", "Item", "Q1", "Q2", "Q3", "Q4"]}
          initialData={[
            ["B1", "Component A", "100", "200", "300", "400"],
            ["B2", "Component B", "150", "250", "350", "450"],
          ]}
          density="compact"
        />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)" }}>Standard (32px cells)</h4>
        <DataGrid
          columns={["Code", "Item", "Q1", "Q2", "Q3", "Q4"]}
          initialData={[
            ["C1", "Resource A", "1,000", "2,000", "3,000", "4,000"],
            ["C2", "Resource B", "1,500", "2,500", "3,500", "4,500"],
          ]}
          density="standard"
        />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)" }}>Comfortable (40px cells)</h4>
        <DataGrid
          columns={["Code", "Item", "Q1", "Q2", "Q3", "Q4"]}
          initialData={[
            ["D1", "Module A", "10,000", "20,000", "30,000", "40,000"],
            ["D2", "Module B", "15,000", "25,000", "35,000", "45,000"],
          ]}
          density="comfortable"
        />
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div>
        <h4 style={{ marginBlockEnd: "0.5rem" }}>Budget Forecasting (Compact)</h4>
        <SpreadsheetGrid
          columns={mockBudgetColumns}
          initialData={mockBudgetData}
          density="compact"
        />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "0.5rem" }}>Ultra-Compact Density</h4>
        <SpreadsheetGrid
          columns={["Code", "Name", "Jan", "Feb", "Mar", "Apr", "May", "Jun"]}
          initialData={[
            ["A1", "Item One", "10", "20", "30", "40", "50", "60"],
            ["A2", "Item Two", "15", "25", "35", "45", "55", "65"],
          ]}
          density="ultra-compact"
        />
      </div>
    </div>
  ),
};

export const GLDistributionMatrix: Story = {
  args: {
    columns: ["Account", "Description", "Debit ($)", "Credit ($)", "Department", "Project Code"],
    initialData: [
      ["1010-CASH", "Operating Bank Account", "125,000.00", "0.00", "Treasury", "PROJ-CORE"],
      ["1200-AR", "Accounts Receivable Clearance", "0.00", "125,000.00", "Finance", "PROJ-CORE"],
      ["4010-REV", "Direct Client Settlement", "0.00", "50,000.00", "Sales", "PROJ-EXP"],
      ["1300-TAX", "Input GST Accrual", "5,000.00", "0.00", "Tax", "PROJ-CORE"],
    ],
    density: "compact",
  },
};
