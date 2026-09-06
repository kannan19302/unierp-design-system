import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import {
  IntercompanyEliminationMatrix,
  type IntercompanyPairLine,
} from "./intercompany-elimination-matrix";

const sampleLines: IntercompanyPairLine[] = [
  {
    id: "ic-1",
    sourceEntity: "US-HoldCo Inc (1000)",
    sourceAccount: "11200 - Due from UK Sub",
    sourceAmount: 250000.0,
    sourceCurrency: "USD",
    targetEntity: "UK-OpCo Ltd (2000)",
    targetAccount: "21200 - Due to US HoldCo",
    targetAmount: 196850.39,
    targetCurrency: "GBP",
    fxRateUsed: 1.27,
    varianceBaseCurrency: 0.0,
    transactionType: "trade_ar_ap",
    status: "matched",
  },
  {
    id: "ic-2",
    sourceEntity: "US-HoldCo Inc (1000)",
    sourceAccount: "11350 - Management Fee Receivable",
    sourceAmount: 45000.0,
    sourceCurrency: "USD",
    targetEntity: "DE-Logistics GmbH (3000)",
    targetAccount: "21350 - Management Fee Payable",
    targetAmount: 38461.54,
    targetCurrency: "EUR",
    fxRateUsed: 1.08,
    varianceBaseCurrency: 3461.54,
    transactionType: "management_fee",
    status: "variance",
  },
];

describe("IntercompanyEliminationMatrix", () => {
  it("renders reconciliation matrix and KPI cards", () => {
    render(<IntercompanyEliminationMatrix lines={sampleLines} />);

    expect(
      screen.getByText("Intercompany Balance Elimination & Reconciliation Matrix")
    ).toBeDefined();
    expect(screen.getAllByText("US-HoldCo Inc (1000)").length).toBeGreaterThan(0);
    expect(screen.getByText("UK-OpCo Ltd (2000)")).toBeDefined();

    expect(screen.getByText("✓ RECONCILED")).toBeDefined();
    expect(screen.getByText("⚠️ VARIANCE DETECTED")).toBeDefined();
  });

  it("handles line selection and triggers batch elimination", () => {
    const onEliminate = vi.fn();
    render(
      <IntercompanyEliminationMatrix lines={sampleLines} onEliminatePairs={onEliminate} />
    );

    const checkbox = screen.getByLabelText(
      "Select pair US-HoldCo Inc (1000) and UK-OpCo Ltd (2000)"
    );
    fireEvent.click(checkbox);

    const eliminateBtn = screen.getByText(/Generate Elimination Entries \(1\)/i);
    fireEvent.click(eliminateBtn);

    expect(onEliminate).toHaveBeenCalledWith(["ic-1"]);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<IntercompanyEliminationMatrix lines={sampleLines} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
