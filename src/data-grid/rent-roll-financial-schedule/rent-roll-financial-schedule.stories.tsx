import type { Meta, StoryObj } from "@storybook/react";
import { RentRollFinancialSchedule, LeaseUnitRow } from "./rent-roll-financial-schedule";

const SAMPLE_UNITS: LeaseUnitRow[] = [
  {
    id: "unit-101",
    unitNumber: "STE-101",
    unitType: "Retail",
    tenantName: "Blue Bottle Coffee Co.",
    squareFeet: 2400,
    leaseStart: "2023-01-01",
    leaseEnd: "2028-12-31",
    monthlyRent: 12500,
    camCharges: 1400,
    depositHeld: 25000,
    arrearsAmount: 0,
    status: "active",
  },
  {
    id: "unit-200",
    unitNumber: "FL-02",
    unitType: "Office",
    tenantName: "Apex Global Venture Capital",
    squareFeet: 8500,
    leaseStart: "2021-06-01",
    leaseEnd: "2026-10-31",
    monthlyRent: 42000,
    camCharges: 4200,
    depositHeld: 84000,
    arrearsAmount: 0,
    status: "expiring_soon",
  },
  {
    id: "unit-300",
    unitNumber: "FL-03",
    unitType: "Office",
    tenantName: "CloudScale Systems Inc.",
    squareFeet: 8500,
    leaseStart: "2022-03-01",
    leaseEnd: "2027-02-28",
    monthlyRent: 43500,
    camCharges: 4350,
    depositHeld: 87000,
    arrearsAmount: 87000, // 2 months delinquent
    status: "delinquent",
  },
  {
    id: "unit-401",
    unitNumber: "STE-401",
    unitType: "Office",
    tenantName: "",
    squareFeet: 3200,
    leaseStart: "",
    leaseEnd: "",
    monthlyRent: 0,
    camCharges: 0,
    depositHeld: 0,
    arrearsAmount: 0,
    status: "vacant",
  },
];

const meta: Meta<typeof RentRollFinancialSchedule> = {
  title: "DataGrid/RentRollFinancialSchedule",
  component: RentRollFinancialSchedule,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof RentRollFinancialSchedule>;

export const Default: Story = {
  args: {
    propertyName: "One Embarcadero Center — San Francisco, CA",
    units: SAMPLE_UNITS,
  },
};

export const FilteredDelinquent: Story = {
  args: {
    propertyName: "One Embarcadero Center — San Francisco, CA",
    units: SAMPLE_UNITS,
  },
};
