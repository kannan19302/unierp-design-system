import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { ThreeWayMatchingMatrix, MatchedLineItem } from "./three-way-matching-matrix";

const sampleItems: MatchedLineItem[] = [
  {
    id: "item-1",
    lineNumber: 10,
    itemCode: "TURB-BLD-01",
    description: "Inconel 718 Turbine Blade",
    poNumber: "PO-88210",
    poQty: 48,
    poUnitPrice: 1250.0,
    grnNumber: "GRN-77401",
    receivedQty: 48,
    invoiceNumber: "INV-2026-9042",
    billedQty: 48,
    billedUnitPrice: 1250.0,
    status: "matched",
  },
  {
    id: "item-2",
    lineNumber: 20,
    itemCode: "O-RING-VITON",
    description: "High-Temperature Viton Seal Kit",
    poNumber: "PO-88210",
    poQty: 200,
    poUnitPrice: 14.5,
    grnNumber: "GRN-77401",
    receivedQty: 200,
    invoiceNumber: "INV-2026-9042",
    billedQty: 200,
    billedUnitPrice: 17.2,
    status: "price_variance",
    varianceReason: "Price variance detected",
  },
];

describe("ThreeWayMatchingMatrix", () => {
  it("renders reconciliation matrix and detects variances", () => {
    render(
      <ThreeWayMatchingMatrix
        invoiceReference="INV-2026-9042"
        poReference="PO-88210"
        vendorName="Apex Dynamics"
        items={sampleItems}
      />
    );

    expect(screen.getByText("Three-Way Reconciliation Matching")).toBeInTheDocument();
    expect(screen.getByText("INV-2026-9042")).toBeInTheDocument();
    expect(screen.getByText("Linked PO-88210")).toBeInTheDocument();
    expect(screen.getByText(/1 Discrepancy Found/i)).toBeInTheDocument();
    expect(screen.getByText("Inconel 718 Turbine Blade")).toBeInTheDocument();
    expect(screen.getByText(/PRICE VARIANCE/i)).toBeInTheDocument();
  });


  it("handles line selection and batch approve", () => {
    const onApprove = vi.fn();
    render(
      <ThreeWayMatchingMatrix
        items={sampleItems}
        onApproveMatch={onApprove}
      />
    );

    const approveBtn = screen.getByRole("button", { name: /Approve Selected/i });
    expect(approveBtn).toBeDisabled();

    // Select all checkbox
    const selectAllCheck = screen.getByRole("checkbox", { name: /Select all lines/i });
    fireEvent.click(selectAllCheck);

    expect(approveBtn).not.toBeDisabled();
    expect(screen.getByRole("button", { name: /Approve Selected \(2\)/i })).toBeInTheDocument();

    fireEvent.click(approveBtn);
    expect(onApprove).toHaveBeenCalledWith(["item-1", "item-2"]);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <ThreeWayMatchingMatrix
        items={sampleItems}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
