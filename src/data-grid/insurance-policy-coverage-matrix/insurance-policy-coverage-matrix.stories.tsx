import type { Meta, StoryObj } from "@storybook/react";
import {
  InsurancePolicyCoverageMatrix,
  PolicyCoverageLine,
} from "./insurance-policy-coverage-matrix";

const sampleLines: PolicyCoverageLine[] = [
  {
    id: "line-gl",
    lineOfBusiness: "Commercial General Liability (CGL)",
    carrierSyndicate: "Chubb Global Markets (Lead 65%) / Travelers (35%)",
    perOccurrenceLimit: 2000000,
    aggregateLimit: 4000000,
    deductibleSir: 25000,
    annualPremium: 42500,
    status: "bound",
    endorsements: ["Additional Insured (CG 20 10)", "Primary & Non-Contributory", "Waiver of Subrogation"],
    sublimits: [
      {
        perilName: "Personal & Advertising Injury",
        limitAmount: 2000000,
        deductible: 25000,
      },
      {
        perilName: "Damage to Rented Premises",
        limitAmount: 1000000,
        deductible: 10000,
      },
      {
        perilName: "Medical Expense Payments",
        limitAmount: 25000,
        deductible: 0,
      },
    ],
  },
  {
    id: "line-cyber",
    lineOfBusiness: "Cyber Risk & Technology Errors & Omissions",
    carrierSyndicate: "Beazley Breach Response Syndicate 2623 / Lloyd's",
    perOccurrenceLimit: 5000000,
    aggregateLimit: 5000000,
    deductibleSir: 50000,
    annualPremium: 38200,
    status: "bound",
    endorsements: ["Ransomware Extortion Coverage", "GDPR Regulatory Fine Defense", "Cloud Outage Consequential"],
    sublimits: [
      {
        perilName: "Ransomware Payment Negotiator",
        limitAmount: 2500000,
        deductible: 50000,
      },
      {
        perilName: "Business Email Compromise (BEC)",
        limitAmount: 1000000,
        deductible: 25000,
      },
    ],
  },
  {
    id: "line-excess",
    lineOfBusiness: "Commercial Umbrella & Excess Liability",
    carrierSyndicate: "AIG Lexington Surplus Lines",
    perOccurrenceLimit: 10000000,
    aggregateLimit: 10000000,
    deductibleSir: 0,
    annualPremium: 29000,
    status: "bound",
    endorsements: ["Follow-Form Underlying Liability", "Worldwide Territory Endorsement"],
  },
];

const meta: Meta<typeof InsurancePolicyCoverageMatrix> = {
  title: "Data Grid/InsurancePolicyCoverageMatrix",
  component: InsurancePolicyCoverageMatrix,
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
type Story = StoryObj<typeof InsurancePolicyCoverageMatrix>;

export const Default: Story = {
  args: {
    policyholderName: "Acme Global Enterprise Technologies Corp.",
    masterPolicyNumber: "POL-2026-US-8910",
    effectiveDates: "Jan 01, 2026 – Dec 31, 2026",
    coverageLines: sampleLines,
    density: "compact",
  },
};

export const UltraCompact: Story = {
  args: {
    ...Default.args,
    density: "ultra-compact",
  },
};
