import type { Meta, StoryObj } from "@storybook/react";
import { TaxEngineBreakdownTable, type TaxLineItem } from "./tax-engine-breakdown-table";

const mockTaxLines: TaxLineItem[] = [
  {
    id: "tax-1",
    jurisdictionName: "United States Federal Excise",
    jurisdictionCode: "US-FED",
    level: "country",
    taxableBase: 120000.0,
    ratePercent: 0.0,
    calculatedTax: 0.0,
    exemptionStatus: "none",
  },
  {
    id: "tax-2",
    jurisdictionName: "State of California Sales Tax",
    jurisdictionCode: "US-CA",
    level: "state",
    taxableBase: 120000.0,
    ratePercent: 6.0,
    calculatedTax: 7200.0,
    exemptionStatus: "none",
  },
  {
    id: "tax-3",
    jurisdictionName: "Santa Clara County Local Tax",
    jurisdictionCode: "US-CA-085",
    level: "county",
    taxableBase: 120000.0,
    ratePercent: 1.25,
    calculatedTax: 1500.0,
    exemptionStatus: "none",
  },
  {
    id: "tax-4",
    jurisdictionName: "City of San Jose Municipal Assessment",
    jurisdictionCode: "US-CA-SJO",
    level: "city",
    taxableBase: 120000.0,
    ratePercent: 1.5,
    calculatedTax: 1800.0,
    exemptionStatus: "none",
  },
  {
    id: "tax-5",
    jurisdictionName: "Silicon Valley Clean Transit District",
    jurisdictionCode: "US-CA-SVTD",
    level: "special_district",
    taxableBase: 120000.0,
    ratePercent: 0.5,
    calculatedTax: 600.0,
    exemptionStatus: "none",
  },
  {
    id: "tax-6",
    jurisdictionName: "Wholesale Hardware Resale Exempt",
    jurisdictionCode: "US-RESALE-01",
    level: "state",
    taxableBase: 35000.0,
    ratePercent: 6.0,
    calculatedTax: 0.0,
    exemptionStatus: "verified",
    certificateNumber: "RESALE-CA-881920",
  },
];

const meta: Meta<typeof TaxEngineBreakdownTable> = {
  title: "DataGrid/TaxEngineBreakdownTable",
  component: TaxEngineBreakdownTable,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TaxEngineBreakdownTable>;

export const Default: Story = {
  args: {
    title: "Multi-Jurisdictional Tax Determination Schedule",
    transactionRef: "TXN-2026-90412",
    lineItems: mockTaxLines,
  },
};

export const Compact: Story = {
  args: {
    title: "Point-of-Sale Real-Time Tax Nexus",
    transactionRef: "POS-2026-0041",
    lineItems: mockTaxLines.slice(0, 4),
    density: "compact",
  },
};
