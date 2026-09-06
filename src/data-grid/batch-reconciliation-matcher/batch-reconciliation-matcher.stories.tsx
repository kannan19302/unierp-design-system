import type { Meta, StoryObj } from "@storybook/react";
import { BatchReconciliationMatcher } from "./batch-reconciliation-matcher";
import type { StatementItem, LedgerItem } from "./batch-reconciliation-matcher";

const mockStatements: StatementItem[] = [
  {
    id: "stmt-1",
    date: "2026-09-01",
    description: "WIRE IN - ACME HOLDINGS CORP",
    reference: "TXN-994810",
    amount: 125000.0,
    currency: "USD",
  },
  {
    id: "stmt-2",
    date: "2026-09-02",
    description: "STRIPE PAYOUT BATCH 4410",
    reference: "STRIPE-002",
    amount: 34890.5,
    currency: "USD",
  },
  {
    id: "stmt-3",
    date: "2026-09-02",
    description: "AWS CLOUD INFRASTRUCTURE INVOICE",
    reference: "INV-AWS-88",
    amount: 14200.75,
    currency: "USD",
  },
  {
    id: "stmt-4",
    date: "2026-09-03",
    description: "PAYROLL TAX EFTPS DEBIT",
    reference: "TAX-2026-09",
    amount: 45000.0,
    currency: "USD",
  },
  {
    id: "stmt-5",
    date: "2026-09-04",
    description: "DIVIDEND DISTRIBUTION Q3",
    reference: "DIV-Q3-01",
    amount: 500000.0,
    currency: "USD",
  },
];

const mockLedgerItems: LedgerItem[] = [
  {
    id: "ledg-1",
    date: "2026-09-01",
    account: "1010-00 - Chase Operating Primary",
    voucherNumber: "VCH-2026-081",
    amount: 125000.0,
    currency: "USD",
  },
  {
    id: "ledg-2",
    date: "2026-09-02",
    account: "1020-00 - Stripe Clearing Account",
    voucherNumber: "VCH-2026-082",
    amount: 34890.5,
    currency: "USD",
  },
  {
    id: "ledg-3",
    date: "2026-09-02",
    account: "6100-00 - Cloud SaaS & Hosting",
    voucherNumber: "VCH-2026-083",
    amount: 14200.75,
    currency: "USD",
  },
  {
    id: "ledg-4",
    date: "2026-09-03",
    account: "2100-00 - Accrued Payroll Taxes",
    voucherNumber: "VCH-2026-084",
    amount: 45000.0,
    currency: "USD",
  },
  {
    id: "ledg-5",
    date: "2026-09-04",
    account: "3050-00 - Retained Earnings Reserves",
    voucherNumber: "VCH-2026-085",
    amount: 500000.0,
    currency: "USD",
  },
];

const meta: Meta<typeof BatchReconciliationMatcher> = {
  title: "DataGrid/BatchReconciliationMatcher",
  component: BatchReconciliationMatcher,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof BatchReconciliationMatcher>;

export const UnmatchedInitialState: Story = {
  args: {
    statements: mockStatements,
    ledgerItems: mockLedgerItems,
    proposedMatches: [],
    currency: "USD",
    density: "compact",
  },
};

export const PrePopulatedMatches: Story = {
  args: {
    statements: mockStatements,
    ledgerItems: mockLedgerItems,
    proposedMatches: [
      {
        statementId: "stmt-1",
        ledgerId: "ledg-1",
        confidence: "exact",
        confidenceScore: 100,
        varianceAmount: 0,
        ruleReason: "Auto exact amount match",
      },
      {
        statementId: "stmt-2",
        ledgerId: "ledg-2",
        confidence: "exact",
        confidenceScore: 100,
        varianceAmount: 0,
        ruleReason: "Auto exact amount match",
      },
    ],
    currency: "USD",
    density: "compact",
  },
};

export const HighDensityUltraCompact: Story = {
  args: {
    statements: mockStatements,
    ledgerItems: mockLedgerItems,
    proposedMatches: [],
    currency: "USD",
    density: "ultra-compact",
  },
};
