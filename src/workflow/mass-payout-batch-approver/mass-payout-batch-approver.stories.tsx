import type { Meta, StoryObj } from "@storybook/react";
import {
  MassPayoutBatchApprover,
  PayoutBatchLine,
} from "./mass-payout-batch-approver";

const mockLines: PayoutBatchLine[] = [
  {
    id: "p1",
    recipientName: "Liam O'Connor",
    country: "Ireland (IE)",
    currency: "EUR",
    payoutAmount: 4850.0,
    usdEquivalent: 5238.0,
    rail: "SEPA",
    ofacScreeningStatus: "passed",
    bankAccountLast4: "4401",
  },
  {
    id: "p2",
    recipientName: "Kenji Sato",
    country: "Japan (JP)",
    currency: "JPY",
    payoutAmount: 750000.0,
    usdEquivalent: 5172.41,
    rail: "SWIFT",
    ofacScreeningStatus: "passed",
    bankAccountLast4: "9102",
  },
  {
    id: "p3",
    recipientName: "Apex Logistics LLC",
    country: "United States (US)",
    currency: "USD",
    payoutAmount: 24500.0,
    usdEquivalent: 24500.0,
    rail: "ACH",
    ofacScreeningStatus: "passed",
    bankAccountLast4: "1198",
  },
];

const meta: Meta<typeof MassPayoutBatchApprover> = {
  title: "Workflow/MassPayoutBatchApprover",
  component: MassPayoutBatchApprover,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof MassPayoutBatchApprover>;

export const Default: Story = {
  args: {
    batchId: "PAY-2026-0906-GL",
    batchTitle: "September 2026 Global Contractor Mass Settlement",
    settlementDate: "2026-09-08",
    totalPayees: 3,
    totalGrossAmount: 34910.41,
    reportingCurrency: "USD",
    fxRateLockSecondsRemaining: 145,
    items: mockLines,
  },
};

export const WithSanctionsHold: Story = {
  args: {
    batchId: "PAY-2026-0906-GL",
    settlementDate: "2026-09-08",
    totalPayees: 3,
    totalGrossAmount: 34910.41,
    items: [
      ...mockLines,
      {
        id: "p4",
        recipientName: "Global Trade Intermediary Ltd",
        country: "Cyprus (CY)",
        currency: "EUR",
        payoutAmount: 18000.0,
        usdEquivalent: 19440.0,
        rail: "SWIFT",
        ofacScreeningStatus: "flagged",
        bankAccountLast4: "0091",
      },
    ],
  },
};

export const UltraCompactDensity: Story = {
  args: {
    batchId: "PAY-2026-0906-GL",
    settlementDate: "2026-09-08",
    totalPayees: 3,
    totalGrossAmount: 34910.41,
    items: mockLines,
    density: "ultra-compact",
  },
};
