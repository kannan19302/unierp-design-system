import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import React from "react";
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

describe("MassPayoutBatchApprover", () => {
  it("renders payout batch summary and recipient lines", () => {
    render(
      <MassPayoutBatchApprover
        batchId="PAY-2026-0906-GL"
        settlementDate="2026-09-08"
        totalPayees={2}
        totalGrossAmount={29738.0}
        items={mockLines}
      />
    );
    expect(screen.getByText("PAY-2026-0906-GL")).toBeInTheDocument();
    expect(screen.getByText("Liam O'Connor")).toBeInTheDocument();
    expect(screen.getByText("Apex Logistics LLC")).toBeInTheDocument();
    expect(screen.getByText("SEPA")).toBeInTheDocument();
  });

  it("handles authorization submission with token", () => {
    const onAuthorize = vi.fn();
    render(
      <MassPayoutBatchApprover
        batchId="PAY-2026-0906-GL"
        settlementDate="2026-09-08"
        totalPayees={2}
        totalGrossAmount={29738.0}
        items={mockLines}
        onAuthorizeBatch={onAuthorize}
      />
    );

    const input = screen.getByPlaceholderText(/Enter 6-digit MFA Token/i);
    fireEvent.change(input, { target: { value: "884912" } });

    const submitBtn = screen.getByRole("button", {
      name: /Authorize & Release Payout/i,
    });
    fireEvent.click(submitBtn);

    expect(onAuthorize).toHaveBeenCalledWith("PAY-2026-0906-GL", "884912");
  });

  it("passes automated accessibility (axe) checks", async () => {
    const { container } = render(
      <MassPayoutBatchApprover
        batchId="PAY-2026-0906-GL"
        settlementDate="2026-09-08"
        totalPayees={2}
        totalGrossAmount={29738.0}
        items={mockLines}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
