import type { Meta, StoryObj } from "@storybook/react";
import {
  SpendCategorySourcingMatrix,
  SpendCategoryItem,
} from "./spend-category-sourcing-matrix";

const sampleCategories: SpendCategoryItem[] = [
  {
    id: "spend_cat_01",
    categoryName: "Cloud Compute & Managed Databases",
    kraljicQuadrant: "STRATEGIC",
    annualSpendUsd: 4200000,
    activeSuppliersCount: 3,
    supplyRiskScore: 78,
    contractExpirationDate: "2026-11-30",
    sourcingStatus: "EXPIRING_SOON",
  },
  {
    id: "spend_cat_02",
    categoryName: "Precision Titanium CNC Castings",
    kraljicQuadrant: "BOTTLENECK",
    annualSpendUsd: 1450000,
    activeSuppliersCount: 1,
    supplyRiskScore: 92,
    contractExpirationDate: "2027-03-15",
    sourcingStatus: "CONTRACTED",
  },
  {
    id: "spend_cat_03",
    categoryName: "Commercial Freight & LTL Logistics",
    kraljicQuadrant: "LEVERAGE",
    annualSpendUsd: 3800000,
    activeSuppliersCount: 8,
    supplyRiskScore: 35,
    contractExpirationDate: "2026-09-30",
    sourcingStatus: "RE_NEGOTIATION",
  },
  {
    id: "spend_cat_04",
    categoryName: "General Facility & Janitorial Supplies",
    kraljicQuadrant: "NON_CRITICAL",
    annualSpendUsd: 290000,
    activeSuppliersCount: 5,
    supplyRiskScore: 18,
    contractExpirationDate: "2027-12-31",
    sourcingStatus: "CONTRACTED",
  },
];

const meta: Meta<typeof SpendCategorySourcingMatrix> = {
  title: "Data Grid/SpendCategorySourcingMatrix",
  component: SpendCategorySourcingMatrix,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof SpendCategorySourcingMatrix>;

export const Default: Story = {
  args: {
    fiscalYear: 2026,
    categories: sampleCategories,
  },
};

export const UltraCompact: Story = {
  args: {
    fiscalYear: 2026,
    categories: sampleCategories,
    density: "ultra-compact",
  },
};
