import type { Meta, StoryObj } from "@storybook/react";
import {
  TenantScreeningScorecard,
  TenantApplicantProfile,
} from "./tenant-screening-scorecard";

const mockApplicant: TenantApplicantProfile = {
  applicantId: "APP-2026-904",
  fullName: "Marcus Vance",
  targetUnit: "Unit 402 - 2BR / 2BA ($2,850/mo)",
  propertyAddress: "1040 Meridian Way, Seattle, WA",
  monthlyIncome: 9500,
  monthlyRent: 2850,
  rentToIncomePct: 30.0,
  overallScore: 88,
  automatedRecommendation: "approve",
  criteria: [
    {
      id: "c1",
      category: "credit",
      name: "FICO Credit Score (Experian)",
      observedValue: "745",
      thresholdRequired: ">= 650",
      status: "pass",
      details: "No delinquent accounts or collections reported in last 24 months.",
    },
    {
      id: "c2",
      category: "income",
      name: "Verified Monthly Net Income",
      observedValue: "$9,500/mo (3.33x rent)",
      thresholdRequired: ">= 3.0x monthly rent",
      status: "pass",
      details: "Verified via Plaid payroll direct deposit from Microsoft Corp.",
    },
    {
      id: "c3",
      category: "eviction",
      name: "National Eviction Search",
      observedValue: "Clear (0 records found)",
      thresholdRequired: "0 filings in 7 years",
      status: "pass",
      details: "No unlawful detainer or eviction actions across 50 state repositories.",
    },
    {
      id: "c4",
      category: "criminal",
      name: "Multi-Jurisdiction Criminal History",
      observedValue: "Clear (0 records found)",
      thresholdRequired: "No disqualifying felonies",
      status: "pass",
      details: "State and federal registry search returned no matches.",
    },
    {
      id: "c5",
      category: "rental_history",
      name: "Prior Landlord Verification",
      observedValue: "Positive (36 months tenancy)",
      thresholdRequired: ">= 24 months on-time payments",
      status: "pass",
      details: "AvalonBay Communities confirmed on-time payments and full deposit refund.",
    },
  ],
};

const meta: Meta<typeof TenantScreeningScorecard> = {
  title: "Data Display/TenantScreeningScorecard",
  component: TenantScreeningScorecard,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TenantScreeningScorecard>;

export const Default: Story = {
  args: {
    applicant: mockApplicant,
  },
};

export const ConditionalDeposit: Story = {
  args: {
    applicant: {
      ...mockApplicant,
      applicantId: "APP-2026-915",
      fullName: "Elena Rostova",
      overallScore: 68,
      automatedRecommendation: "conditional_deposit",
      rentToIncomePct: 34.5,
      criteria: [
        {
          id: "c1",
          category: "credit",
          name: "FICO Credit Score",
          observedValue: "635",
          thresholdRequired: ">= 650",
          status: "conditional",
          details: "Medical collection dispute noted; otherwise clean credit line.",
        },
        {
          id: "c2",
          category: "income",
          name: "Verified Net Income",
          observedValue: "2.9x rent",
          thresholdRequired: ">= 3.0x monthly rent",
          status: "conditional",
          details: "Freelance 1099 income stream; 18 months tax return submitted.",
        },
      ],
    },
  },
};

export const UltraCompactDensity: Story = {
  args: {
    applicant: mockApplicant,
    density: "ultra-compact",
  },
};
