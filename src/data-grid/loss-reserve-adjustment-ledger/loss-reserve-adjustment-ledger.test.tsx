import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import {
  LossReserveAdjustmentLedger,
  type ClaimFinancialSummary,
  type ReserveAdjustmentRecord,
} from "./loss-reserve-adjustment-ledger";

const sampleClaim: ClaimFinancialSummary = {
  claimNumber: "CLM-2026-88190",
  policyNumber: "POL-GL-99401",
  insuredName: "Apex Industrial Logistics Corp",
  dateOfLoss: "2026-06-14",
  claimantName: "Robert Miller",
  totalIncurred: 85000.0,
  totalPaid: 22500.0,
  totalOutstandingReserve: 62500.0,
  adjusterAuthorityLimit: 50000.0,
};

const sampleAdjustments: ReserveAdjustmentRecord[] = [
  {
    id: "adj-1",
    transactionDate: "2026-06-15",
    bucket: "indemnity",
    priorReserve: 0.0,
    adjustedAmount: 25000.0,
    newReserve: 25000.0,
    adjusterName: "Marcus Thorne",
    adjusterNpn: "NPN-9941029",
    reasonCode: "INITIAL_RESERVE_SETUP",
    requiresSupervisorSignoff: false,
    isSignedOff: true,
  },
  {
    id: "adj-2",
    transactionDate: "2026-09-01",
    bucket: "expense_dcc",
    priorReserve: 15000.0,
    adjustedAmount: 40000.0,
    newReserve: 55000.0,
    adjusterName: "Marcus Thorne",
    adjusterNpn: "NPN-9941029",
    reasonCode: "REVAL_LITIGATION_RISK",
    requiresSupervisorSignoff: true,
    isSignedOff: false,
  },
];

describe("LossReserveAdjustmentLedger", () => {
  it("renders claim exposure summary and adjustments ledger", () => {
    render(
      <LossReserveAdjustmentLedger
        claim={sampleClaim}
        initialAdjustments={sampleAdjustments}
      />
    );

    expect(
      screen.getByText("Statutory Loss Reserve & Incurred Adjustment Ledger")
    ).toBeDefined();
    expect(screen.getByText("CLM-2026-88190")).toBeDefined();
    expect(screen.getByText("Apex Industrial Logistics Corp")).toBeDefined();
    expect(screen.getByText("Post Reserve Adjustment")).toBeDefined();
    expect(screen.getByText("⚠️ Over-Limit Pending")).toBeDefined();
  });

  it("posts a new reserve adjustment delta", () => {
    const onAdd = vi.fn();
    render(
      <LossReserveAdjustmentLedger
        claim={sampleClaim}
        initialAdjustments={sampleAdjustments}
        onAddAdjustment={onAdd}
      />
    );

    const amountInput = screen.getByLabelText(/Adjustment Delta/i);
    const postBtn = screen.getByText("+ Post Statutory Reserve Modification");

    fireEvent.change(amountInput, { target: { value: "5000" } });
    fireEvent.click(postBtn);

    expect(onAdd).toHaveBeenCalled();
  });

  it("handles supervisor sign-off approval", () => {
    const onSignoff = vi.fn();
    render(
      <LossReserveAdjustmentLedger
        claim={sampleClaim}
        initialAdjustments={sampleAdjustments}
        onApproveSupervisorSignoff={onSignoff}
      />
    );

    const signoffBtn = screen.getByText("Sign Off");
    fireEvent.click(signoffBtn);

    expect(onSignoff).toHaveBeenCalledWith("adj-2");
    expect(screen.getByText("✓ Approved")).toBeDefined();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <LossReserveAdjustmentLedger
        claim={sampleClaim}
        initialAdjustments={sampleAdjustments}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
