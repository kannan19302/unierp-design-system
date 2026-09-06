import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
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
    description: "STRIPE PAYOUT BATCH",
    reference: "STRIPE-002",
    amount: 34890.5,
    currency: "USD",
  },
];

const mockLedgerItems: LedgerItem[] = [
  {
    id: "ledg-1",
    date: "2026-09-01",
    account: "1010-00 - Operating Primary",
    voucherNumber: "VCH-081",
    amount: 125000.0,
    currency: "USD",
  },
  {
    id: "ledg-2",
    date: "2026-09-02",
    account: "1020-00 - Stripe Clearing",
    voucherNumber: "VCH-082",
    amount: 34890.5,
    currency: "USD",
  },
];

describe("BatchReconciliationMatcher", () => {
  it("renders statement and ledger dual pane tables", () => {
    render(
      <BatchReconciliationMatcher
        statements={mockStatements}
        ledgerItems={mockLedgerItems}
      />
    );

    expect(screen.getByText("External Statement Records")).toBeInTheDocument();
    expect(screen.getByText("Internal General Ledger")).toBeInTheDocument();
    expect(screen.getByText("WIRE IN - ACME HOLDINGS CORP")).toBeInTheDocument();
    expect(screen.getByText("1010-00 - Operating Primary")).toBeInTheDocument();
  });

  it("filters records via search input", () => {
    render(
      <BatchReconciliationMatcher
        statements={mockStatements}
        ledgerItems={mockLedgerItems}
      />
    );

    const searchInput = screen.getByLabelText(/Filter records/i);
    fireEvent.change(searchInput, { target: { value: "STRIPE" } });

    expect(screen.getByText("STRIPE PAYOUT BATCH")).toBeInTheDocument();
    expect(screen.queryByText("WIRE IN - ACME HOLDINGS CORP")).not.toBeInTheDocument();
  });

  it("links selected statement and ledger records", () => {
    const onConfirmMatches = vi.fn();
    render(
      <BatchReconciliationMatcher
        statements={mockStatements}
        ledgerItems={mockLedgerItems}
        onConfirmMatches={onConfirmMatches}
      />
    );

    const linkBtn = screen.getByRole("button", { name: /Link Selected/i });
    expect(linkBtn).toBeDisabled();

    // Select statement row
    fireEvent.click(screen.getByText("WIRE IN - ACME HOLDINGS CORP"));
    // Select ledger row
    fireEvent.click(screen.getByText("1010-00 - Operating Primary"));

    expect(linkBtn).not.toBeDisabled();
    fireEvent.click(linkBtn);

    // After link, badge should show 100%
    expect(screen.getByText("100%")).toBeInTheDocument();

    const confirmBtn = screen.getByRole("button", { name: /Confirm Matches \(1\)/i });
    fireEvent.click(confirmBtn);
    expect(onConfirmMatches).toHaveBeenCalledTimes(1);
    expect(onConfirmMatches).toHaveBeenCalledWith([
      expect.objectContaining({
        statementId: "stmt-1",
        ledgerId: "ledg-1",
        confidence: "exact",
        confidenceScore: 100,
      }),
    ]);
  });

  it("auto-matches exact records automatically", () => {
    render(
      <BatchReconciliationMatcher
        statements={mockStatements}
        ledgerItems={mockLedgerItems}
      />
    );

    const autoMatchBtn = screen.getByRole("button", { name: /Auto-Match \(100% Exact\)/i });
    fireEvent.click(autoMatchBtn);

    // Both items should now be matched with 100% badges
    const badges = screen.getAllByText("100%");
    expect(badges.length).toBe(2);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <BatchReconciliationMatcher
        statements={mockStatements}
        ledgerItems={mockLedgerItems}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
