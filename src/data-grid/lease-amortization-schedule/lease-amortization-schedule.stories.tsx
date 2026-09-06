import type { Meta, StoryObj } from "@storybook/react";
import {
  LeaseAmortizationSchedule,
  LeaseSchedulePeriod,
} from "./lease-amortization-schedule";

const mockPeriods: LeaseSchedulePeriod[] = [
  {
    periodNumber: 1,
    paymentDate: "2026-10-01",
    paymentAmount: 62500,
    interestExpense: 14218,
    principalReduction: 48282,
    endingLiability: 3201718,
    rouDepreciation: 54166,
    endingRouAsset: 3195834,
    fiscalYear: 2026,
  },
  {
    periodNumber: 2,
    paymentDate: "2026-11-01",
    paymentAmount: 62500,
    interestExpense: 14007,
    principalReduction: 48493,
    endingLiability: 3153225,
    rouDepreciation: 54166,
    endingRouAsset: 3141668,
    fiscalYear: 2026,
  },
  {
    periodNumber: 3,
    paymentDate: "2026-12-01",
    paymentAmount: 62500,
    interestExpense: 13795,
    principalReduction: 48705,
    endingLiability: 3104520,
    rouDepreciation: 54166,
    endingRouAsset: 3087502,
    fiscalYear: 2026,
  },
  {
    periodNumber: 4,
    paymentDate: "2027-01-01",
    paymentAmount: 62500,
    interestExpense: 13582,
    principalReduction: 48918,
    endingLiability: 3055602,
    rouDepreciation: 54166,
    endingRouAsset: 3033336,
    fiscalYear: 2027,
  },
  {
    periodNumber: 5,
    paymentDate: "2027-02-01",
    paymentAmount: 62500,
    interestExpense: 13368,
    principalReduction: 49132,
    endingLiability: 3006470,
    rouDepreciation: 54166,
    endingRouAsset: 2979170,
    fiscalYear: 2027,
  },
];

const meta: Meta<typeof LeaseAmortizationSchedule> = {
  title: "Data Grid/LeaseAmortizationSchedule",
  component: LeaseAmortizationSchedule,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof LeaseAmortizationSchedule>;

export const Default: Story = {
  args: {
    leaseIdentifier: "LSE-HQ-008",
    assetDescription: "Floor 14-16 Corporate Headquarters (45,000 sq ft)",
    lessorName: "Brookfield Commercial Properties REIT",
    classification: "operating",
    commencementDate: "2026-10-01",
    expirationDate: "2031-09-30",
    discountRatePercent: 5.25,
    initialRouAsset: 3250000,
    initialLiability: 3250000,
    periods: mockPeriods,
    density: "compact",
  },
};

export const FinanceLease: Story = {
  args: {
    leaseIdentifier: "LSE-EQ-442",
    assetDescription: "CNC 5-Axis Milling Machinery Unit #3",
    lessorName: "Siemens Financial Services AG",
    classification: "finance",
    commencementDate: "2026-01-01",
    expirationDate: "2030-12-31",
    discountRatePercent: 6.0,
    initialRouAsset: 850000,
    initialLiability: 850000,
    periods: mockPeriods.map((p) => ({
      ...p,
      paymentAmount: 18500,
      interestExpense: 4250,
      principalReduction: 14250,
    })),
    density: "standard",
  },
};
