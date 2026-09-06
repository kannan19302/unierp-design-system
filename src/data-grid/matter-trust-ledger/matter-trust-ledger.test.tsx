import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import React from "react";
import {
  MatterTrustLedger,
  TrustLedgerEntry,
} from "./matter-trust-ledger";

const mockEntries: TrustLedgerEntry[] = [
  {
    id: "tx-1",
    date: "2026-08-01",
    type: "retainer_deposit",
    payeeOrPayor: "Acme Corporation",
    description: "Initial case retainer",
    amount: 50000.0,
    runningTrustBalance: 50000.0,
    voucherRef: "VCH-TR-8001",
    reconciliationStatus: "cleared",
  },
  {
    id: "tx-2",
    date: "2026-08-15",
    type: "disbursement_expense",
    payeeOrPayor: "US District Court",
    description: "Filing fee",
    amount: -850.0,
    runningTrustBalance: 49150.0,
    voucherRef: "VCH-TR-8042",
    reconciliationStatus: "cleared",
  },
];

describe("MatterTrustLedger", () => {
  it("renders matter details, trust balance, and transactions", () => {
    render(
      <MatterTrustLedger
        matterId="MAT-2026-0812"
        matterName="Acme Patent Dispute"
        clientName="Acme Corporation"
        entries={mockEntries}
      />
    );
    expect(
      screen.getByText("Client Trust Accounting Ledger: Acme Patent Dispute")
    ).toBeInTheDocument();
    expect(screen.getByText("MAT-2026-0812")).toBeInTheDocument();
    expect(screen.getAllByText("Acme Corporation").length).toBeGreaterThan(0);
    expect(screen.getByText("VCH-TR-8001")).toBeInTheDocument();
  });

  it("handles disbursement and replenishment button actions", () => {
    const onDisburse = vi.fn();
    const onReplenish = vi.fn();

    render(
      <MatterTrustLedger
        matterId="MAT-2026-0812"
        matterName="Acme Patent Dispute"
        clientName="Acme Corporation"
        minimumRetainerThreshold={60000} // higher than 49150 to trigger replenishment button
        entries={mockEntries}
        onRequestDisbursement={onDisburse}
        onRequestReplenishment={onReplenish}
      />
    );

    const disburseBtn = screen.getByRole("button", {
      name: /\+ Disburse Trust Funds/i,
    });
    fireEvent.click(disburseBtn);
    expect(onDisburse).toHaveBeenCalledWith("MAT-2026-0812");

    const replenishBtn = screen.getByRole("button", {
      name: /Request Replenishment/i,
    });
    fireEvent.click(replenishBtn);
    expect(onReplenish).toHaveBeenCalledWith("MAT-2026-0812", 10850);
  });

  it("passes automated accessibility (axe) checks", async () => {
    const { container } = render(
      <MatterTrustLedger
        matterId="MAT-2026-0812"
        matterName="Acme Patent Dispute"
        clientName="Acme Corporation"
        entries={mockEntries}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
