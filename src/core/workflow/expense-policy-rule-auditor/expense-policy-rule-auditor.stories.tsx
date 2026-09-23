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

const compliantTransaction: ExpenseTransactionAuditItem = {
  ...sampleTransaction,
  id: "TX-EXP-88905",
  status: "policy_approved",
  ruleChecks: sampleTransaction.ruleChecks.map((c) => ({
    ...c,
    passed: true,
    severity: "info",
    observedValue: "$210.00/night (3 nights)",
  })),
};

const meta: Meta<typeof ExpensePolicyRuleAuditor> = {
  title: "Core/Workflow/ExpensePolicyRuleAuditor",
  component: ExpensePolicyRuleAuditor,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
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

export const Comfortable: Story = {
  args: {
    density: "comfortable",
  },
};

export const Compliant: Story = {
  args: {
    transaction: compliantTransaction,
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "900px" }}>
      <div>
        <h4 style={{ margin: "0 0 8px 0" }}>Expense Policy Rule Auditor</h4>
        <ExpensePolicyRuleAuditor transaction={sampleTransaction} density="compact" />
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px", maxWidth: "900px" }}>
      <div>
        <h4 style={{ margin: "0 0 8px 0" }}>Violation / Override Required</h4>
        <ExpensePolicyRuleAuditor transaction={sampleTransaction} density="compact" />
      </div>
      <div>
        <h4 style={{ margin: "0 0 8px 0" }}>Policy Compliant / Auto-Approved</h4>
        <ExpensePolicyRuleAuditor transaction={compliantTransaction} density="comfortable" />
      </div>
    </div>
  ),
};
