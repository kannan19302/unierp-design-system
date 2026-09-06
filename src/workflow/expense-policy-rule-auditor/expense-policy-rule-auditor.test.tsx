import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
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
  ],
};

describe("ExpensePolicyRuleAuditor", () => {
  it("renders transaction details and policy violation alerts", () => {
    render(<ExpensePolicyRuleAuditor transaction={sampleTransaction} />);

    expect(
      screen.getByText("Corporate Spend & Expense Policy Rule Auditor")
    ).toBeDefined();
    expect(screen.getByText("Elena Rostova")).toBeDefined();
    expect(screen.getByText("Grand Hyatt San Francisco")).toBeDefined();
    expect(screen.getByText("⛔ BLOCKING VIOLATION")).toBeDefined();
    expect(screen.getByText(/Room rate exceeds maximum allowable/i)).toBeDefined();
  });

  it("requires justification before submitting manager override", () => {
    const onOverride = vi.fn();
    render(
      <ExpensePolicyRuleAuditor
        transaction={sampleTransaction}
        onOverride={onOverride}
      />
    );

    const overrideBtn = screen.getByText("Authorize Policy Override");
    expect((overrideBtn as HTMLButtonElement).disabled).toBe(true);

    const textarea = screen.getByLabelText(
      /Manager Exception Override Justification/i
    );
    fireEvent.change(textarea, {
      target: { value: "Approved due to urgent client conference peak pricing" },
    });

    expect((overrideBtn as HTMLButtonElement).disabled).toBe(false);
    fireEvent.click(overrideBtn);

    expect(onOverride).toHaveBeenCalledWith(
      "TX-EXP-88902",
      "Approved due to urgent client conference peak pricing"
    );
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <ExpensePolicyRuleAuditor transaction={sampleTransaction} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
