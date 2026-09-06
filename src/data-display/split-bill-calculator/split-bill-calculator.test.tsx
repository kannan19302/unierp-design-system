import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import React from "react";
import {
  SplitBillCalculator,
  BillLineItem,
} from "./split-bill-calculator";

const mockItems: BillLineItem[] = [
  { id: "i1", name: "Prime Ribeye", quantity: 1, unitPrice: 60.0 },
  { id: "i2", name: "House Wine", quantity: 1, unitPrice: 40.0 },
];

describe("SplitBillCalculator", () => {
  it("renders check items, subtotal, and split share", () => {
    render(
      <SplitBillCalculator
        checkNumber="CHK-8812"
        tableNumber="Table 14"
        items={mockItems}
        initialGuestCount={2}
      />
    );
    expect(screen.getByText("CHK-8812")).toBeInTheDocument();
    expect(screen.getByText("Table 14")).toBeInTheDocument();
    expect(screen.getByText("Prime Ribeye")).toBeInTheDocument();
    expect(screen.getByText("House Wine")).toBeInTheDocument();
  });

  it("handles payment tender recording", () => {
    const onRecordPayment = vi.fn();
    render(
      <SplitBillCalculator
        checkNumber="CHK-8812"
        tableNumber="Table 14"
        items={mockItems}
        initialGuestCount={2}
        onRecordPayment={onRecordPayment}
      />
    );

    const amountInput = screen.getByLabelText(/Payment Amount/i);
    fireEvent.change(amountInput, { target: { value: "50.00" } });

    const applyBtn = screen.getByRole("button", { name: /\+ Apply Payment/i });
    fireEvent.click(applyBtn);

    expect(onRecordPayment).toHaveBeenCalledWith({
      method: "card",
      amount: 50.0,
      guestIndex: 1,
    });
  });

  it("passes automated accessibility (axe) checks", async () => {
    const { container } = render(
      <SplitBillCalculator
        checkNumber="CHK-8812"
        tableNumber="Table 14"
        items={mockItems}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
