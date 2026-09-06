import type { Meta, StoryObj } from "@storybook/react";
import {
  CamExpenseReconciliationLedger,
  PropertySpecification,
  CamExpenseItem,
} from "./cam-expense-reconciliation-ledger";

const sampleProperty: PropertySpecification = {
  id: "prop_one_financial_01",
  propertyName: "One Financial Center, Boston",
  tenantName: "Deloitte Global Services LLC",
  suiteNumber: "Suite 2400",
  leasedAreaSqFt: 45000,
  buildingGrossLeasableSqFt: 600000,
  proRataSharePercent: 7.5,
  fiscalYear: 2025,
};

const sampleCategories: CamExpenseItem[] = [
  {
    id: "cam_exp_hvac_01",
    expenseCategory: "HVAC Operations & Maintenance",
    annualBudgetUsd: 450000.0,
    actualExpenseUsd: 472500.0,
    varianceUsd: 22500.0,
    tenantShareEstimatedUsd: 33750.0,
    tenantShareActualUsd: 35437.5,
    reconciliationDueUsd: 1687.5,
  },
  {
    id: "cam_exp_jan_02",
    expenseCategory: "Janitorial & Common Area Cleaning",
    annualBudgetUsd: 320000.0,
    actualExpenseUsd: 310000.0,
    varianceUsd: -10000.0,
    tenantShareEstimatedUsd: 24000.0,
    tenantShareActualUsd: 23250.0,
    reconciliationDueUsd: -750.0,
  },
  {
    id: "cam_exp_ins_03",
    expenseCategory: "Commercial Property & Casualty Insurance",
    annualBudgetUsd: 280000.0,
    actualExpenseUsd: 305000.0,
    varianceUsd: 25000.0,
    tenantShareEstimatedUsd: 21000.0,
    tenantShareActualUsd: 22875.0,
    reconciliationDueUsd: 1875.0,
  },
  {
    id: "cam_exp_sec_04",
    expenseCategory: "Physical Security & Turnstile Access",
    annualBudgetUsd: 190000.0,
    actualExpenseUsd: 188000.0,
    varianceUsd: -2000.0,
    tenantShareEstimatedUsd: 14250.0,
    tenantShareActualUsd: 14100.0,
    reconciliationDueUsd: -150.0,
  },
];

const meta: Meta<typeof CamExpenseReconciliationLedger> = {
  title: "Data Grid/CamExpenseReconciliationLedger",
  component: CamExpenseReconciliationLedger,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof CamExpenseReconciliationLedger>;

export const Default: Story = {
  args: {
    property: sampleProperty,
    expenseCategories: sampleCategories,
  },
};

export const UltraCompact: Story = {
  args: {
    property: sampleProperty,
    expenseCategories: sampleCategories,
    density: "ultra-compact",
  },
};
