import type { Meta, StoryObj } from "@storybook/react";
import {
  MassPayoutBatchApprover,
  type PayoutBatchLine,
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
    density: "compact",
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
    density: "compact",
  },
};

export const UltraCompactDensity: Story = {
  args: {
    ...Default.args,
    density: "ultra-compact",
  },
};

export const Comfortable: Story = {
  args: {
    ...Default.args,
    density: "comfortable",
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "900px" }}>
      <div>
        <h4 style={{ margin: "0 0 8px 0" }}>Mass Payout Batch Approver</h4>
        <MassPayoutBatchApprover
          batchId="PAY-2026-0906-GL"
          batchTitle="September 2026 Global Contractor Mass Settlement"
          settlementDate="2026-09-08"
          totalPayees={3}
          totalGrossAmount={34910.41}
          items={mockLines}
          density="compact"
        />
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px", maxWidth: "900px" }}>
      <div>
        <h4 style={{ margin: "0 0 8px 0" }}>Clean Batch (Ready for Dual-Authorization)</h4>
        <MassPayoutBatchApprover
          batchId="PAY-2026-0906-GL"
          settlementDate="2026-09-08"
          totalPayees={3}
          totalGrossAmount={34910.41}
          items={mockLines}
          density="compact"
        />
      </div>
      <div>
        <h4 style={{ margin: "0 0 8px 0" }}>Sanctions Flagged Batch (Blocked Release)</h4>
        <MassPayoutBatchApprover
          batchId="PAY-2026-0906-GL"
          settlementDate="2026-09-08"
          totalPayees={4}
          totalGrossAmount={54350.41}
          items={[
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
          ]}
          density="comfortable"
        />
      </div>
    </div>
  ),
};
