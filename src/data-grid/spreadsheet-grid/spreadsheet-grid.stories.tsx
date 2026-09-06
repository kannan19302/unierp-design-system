import type { Meta, StoryObj } from "@storybook/react";
import { SpreadsheetGrid } from "./spreadsheet-grid";

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
  title: "DataGrid/SpreadsheetGrid",
  component: SpreadsheetGrid,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
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

export const UltraCompactDensity: Story = {
  args: {
    columns: ["Code", "Name", "Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    initialData: [
      ["A1", "Item One", "10", "20", "30", "40", "50", "60"],
      ["A2", "Item Two", "15", "25", "35", "45", "55", "65"],
      ["A3", "Item Three", "12", "22", "32", "42", "52", "62"],
    ],
    density: "ultra-compact",
  },
};
