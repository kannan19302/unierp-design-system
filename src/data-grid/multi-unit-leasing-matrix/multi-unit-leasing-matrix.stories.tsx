import type { Meta, StoryObj } from "@storybook/react";
import { MultiUnitLeasingMatrix, CommercialLeaseUnit } from "./multi-unit-leasing-matrix";

const sampleUnits: CommercialLeaseUnit[] = [
  {
    id: "suite-1400",
    unitCode: "SUITE-1400",
    floor: 14,
    rentableSqFt: 18500,
    usableSqFt: 16800,
    tenantName: "Apex Global Payments",
    industry: "Financial Technology",
    baseRentPerSqFt: 86.5,
    camNnnPerSqFt: 19.2,
    leaseCommencement: "2021-06-01",
    leaseExpiration: "2027-05-31",
    status: "leased",
  },
  {
    id: "suite-1450",
    unitCode: "SUITE-1450",
    floor: 14,
    rentableSqFt: 7200,
    usableSqFt: 6500,
    tenantName: "Meridian Cloud Security",
    industry: "Enterprise Cyber",
    baseRentPerSqFt: 88.0,
    camNnnPerSqFt: 19.2,
    leaseCommencement: "2023-01-01",
    leaseExpiration: "2028-12-31",
    status: "leased",
  },
  {
    id: "suite-1500",
    unitCode: "SUITE-1500",
    floor: 15,
    rentableSqFt: 25700,
    usableSqFt: 23400,
    tenantName: "Kinetics BioLabs",
    industry: "Life Sciences & AI",
    baseRentPerSqFt: 94.0,
    camNnnPerSqFt: 22.0,
    leaseCommencement: "2019-10-01",
    leaseExpiration: "2026-09-30",
    status: "renewal_pending",
  },
  {
    id: "suite-1600",
    unitCode: "SUITE-1600",
    floor: 16,
    rentableSqFt: 14200,
    usableSqFt: 12900,
    tenantName: undefined,
    baseRentPerSqFt: 82.0,
    camNnnPerSqFt: 18.5,
    status: "available",
  },
  {
    id: "suite-1650",
    unitCode: "SUITE-1650",
    floor: 16,
    rentableSqFt: 11500,
    usableSqFt: 10400,
    tenantName: "Vanguard Legal Partners",
    industry: "Corporate & IP Law",
    baseRentPerSqFt: 84.0,
    camNnnPerSqFt: 18.5,
    leaseCommencement: "2026-11-01",
    leaseExpiration: "2031-10-31",
    status: "under_loi",
  },
];

const meta: Meta<typeof MultiUnitLeasingMatrix> = {
  title: "Data Grid/MultiUnitLeasingMatrix",
  component: MultiUnitLeasingMatrix,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    density: {
      control: { type: "select" },
      options: ["ultra-compact", "compact", "standard", "comfortable"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof MultiUnitLeasingMatrix>;

export const Default: Story = {
  args: {
    propertyName: "One Embarcadero Center",
    propertyAddress: "1 Embarcadero Ctr, Financial District, San Francisco CA",
    units: sampleUnits,
    density: "compact",
  },
};

export const UltraCompact: Story = {
  args: {
    ...Default.args,
    density: "ultra-compact",
  },
};
