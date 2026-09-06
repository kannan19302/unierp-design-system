import type { Meta, StoryObj } from "@storybook/react";
import {
  ExpensePolicyRuleAuditor,
  type ExpenseTransactionAuditItem,
} from "./expense-policy-rule-auditor";

const sampleTransaction: ExpenseTransactionAuditItem = {
  id: "TX-EXP-88902",
  cardHolderName: "Elena Rostova",
  department: "Product Engineering",
  merchantName: "Grand Hyatt San Francisco",
  mccCode: "3501 - Hotels/Motels",
  transactionDate: "2026-09-04",
  amount: 1155.0,
  currency: "USD",
  receiptAttached: true,
  receiptOcrConfidencePct: 98,
  status: "manager_override_required",
  ruleChecks: [
    {
      id: "rule-1",
      ruleName: "Merchant Category Code (MCC) Whitelist",
      passed: true,
      severity: "info",
      observedValue: "MCC 3501 (Hotel Lodging)",
      policyLimit: "Travel Approved MCCs",
      message: "Lodging merchant is pre-approved for engineering travel.",
    },
    {
      id: "rule-2",
      ruleName: "Per Diem Nightly Lodging Maximum ($250/night)",
      passed: false,
      severity: "violation_block",
      observedValue: "$385.00/night (3 nights)",
      policyLimit: "$250.00/night",
      message: "Room rate exceeds maximum allowable San Francisco lodging tier by $135/night.",
    },
    {
      id: "rule-3",
      ruleName: "IRS Compliant Receipt Documentation ($75+)",
      passed: true,
      severity: "info",
      observedValue: "PDF Folio Receipt attached",
      policyLimit: "Mandatory for > $75.00",
      message: "Itemized folio receipt matched folio total exactly.",
    },
  ],
};

const meta: Meta<typeof ExpensePolicyRuleAuditor> = {
  title: "Workflow/ExpensePolicyRuleAuditor",
  component: ExpensePolicyRuleAuditor,
  parameters: {
    layout: "padded",
  },
  args: {
    transaction: sampleTransaction,
  },
};

export default meta;
type Story = StoryObj<typeof ExpensePolicyRuleAuditor>;

export const Default: Story = {
  args: {},
};

export const UltraCompact: Story = {
  args: {
    density: "ultra-compact",
  },
};
