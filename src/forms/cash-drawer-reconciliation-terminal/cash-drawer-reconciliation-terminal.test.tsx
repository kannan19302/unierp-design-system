import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { CashDrawerReconciliationTerminal } from "./cash-drawer-reconciliation-terminal";

const mockShift = {
  shiftId: "SHIFT-01",
  terminalId: "TERM-01",
  cashierName: "Alex Mercer",
  openingFloat: 200.0,
  posCashSales: 800.0,
  cashPaidOut: 0.0, // Expected = 1000.00
};

describe("CashDrawerReconciliationTerminal", () => {
  it("passes axe accessibility tests with zero violations", async () => {
    const { container } = render(
      <CashDrawerReconciliationTerminal shiftContext={mockShift} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders shift context and initial zero counts", () => {
    render(<CashDrawerReconciliationTerminal shiftContext={mockShift} />);
    expect(
      screen.getByText("POS Cash Drawer Shift Closeout & Till Count Terminal")
    ).toBeInTheDocument();
    expect(screen.getByText(/TERM-01/i)).toBeInTheDocument();
    expect(screen.getByText("Alex Mercer", { exact: false })).toBeInTheDocument();
  });

  it("updates denomination counts and reflects variance accurately", () => {
    render(<CashDrawerReconciliationTerminal shiftContext={mockShift} />);

    // Enter 10 x $100 bills = $1,000.00 (Exact match, variance = $0.00)
    const hundredInput = screen.getByLabelText("$100 Bills");
    fireEvent.change(hundredInput, { target: { value: "10" } });

    expect(screen.getAllByText("$1,000.00").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText(/0\.00.*\(BALANCED\)/i)).toBeInTheDocument();
  });

  it("submits closeout and calls onCommitCloseout callback", () => {
    const handleCommit = vi.fn();
    render(
      <CashDrawerReconciliationTerminal
        shiftContext={mockShift}
        onCommitCloseout={handleCommit}
      />
    );

    const hundredInput = screen.getByLabelText("$100 Bills");
    fireEvent.change(hundredInput, { target: { value: "10" } });

    const submitBtn = screen.getByRole("button", { name: /commit drawer reconciliation/i });
    fireEvent.click(submitBtn);

    expect(handleCommit).toHaveBeenCalledWith({
      shiftId: "SHIFT-01",
      actualTotal: 1000,
      expectedTotal: 1000,
      variance: 0,
      reasonCode: undefined,
      notes: "",
    });

    expect(screen.getByText("SHIFT CLOSED (Z-REPORT DISPATCHED)")).toBeInTheDocument();
  });
});
