import type { Meta, StoryObj } from "@storybook/react";
import { SubcontractorComplianceLienTracker } from "./subcontractor-compliance-lien-tracker";

const meta: Meta<typeof SubcontractorComplianceLienTracker> = {
  title: "DataGrid/SubcontractorComplianceLienTracker",
  component: SubcontractorComplianceLienTracker,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SubcontractorComplianceLienTracker>;

const mockRecords = [
  {
    id: "sub-1",
    vendorName: "Apex Structural Steel Fabricators",
    tradeDivision: "05 12 00 - Structural Framing",
    contractCode: "PKG-2026-STEEL-01",
    coiValidUntil: "2026-12-31",
    coiExpired: false,
    retainageHeld: 48500,
    currentBilling: 215000,
    lienStatus: "UNCONDITIONAL_PROGRESS" as const,
    paymentStatus: "AUTHORIZED" as const,
  },
  {
    id: "sub-2",
    vendorName: "Delta Mechanical HVAC & Chillers",
    tradeDivision: "23 00 00 - Mechanical & HVAC",
    contractCode: "PKG-2026-HVAC-04",
    coiValidUntil: "2026-08-30",
    coiExpired: true,
    retainageHeld: 32000,
    currentBilling: 145000,
    lienStatus: "CONDITIONAL_PROGRESS" as const,
    paymentStatus: "ON_HOLD" as const,
  },
  {
    id: "sub-3",
    vendorName: "Kodiak Concrete & Foundation LLC",
    tradeDivision: "03 30 00 - Cast-in-Place Concrete",
    contractCode: "PKG-2026-CONC-08",
    coiValidUntil: "2027-04-15",
    coiExpired: false,
    retainageHeld: 62000,
    currentBilling: 310000,
    lienStatus: "LIEN_NOTICE_FILED" as const,
    paymentStatus: "ON_HOLD" as const,
  },
];

export const Default: Story = {
  args: {
    records: mockRecords,
    density: "compact",
  },
};

export const UltraCompact: Story = {
  args: {
    records: mockRecords,
    density: "ultra-compact",
  },
};

export const Comfortable: Story = {
  args: {
    records: mockRecords,
    density: "comfortable",
  },
};
