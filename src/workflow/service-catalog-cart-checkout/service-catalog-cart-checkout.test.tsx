import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import React from "react";
import { ServiceCatalogCartCheckout, ServiceCartItem } from "./service-catalog-cart-checkout";

const sampleItems: ServiceCartItem[] = [
  {
    id: "item-1",
    name: "MacBook Pro 16-inch M3 Max",
    sku: "IT-HW-MBP16-01",
    category: "hardware",
    quantity: 1,
    unitPrice: 3499.0,
    billingFrequency: "one_time",
    slaDays: 3,
    specSummary: "36GB Unified Memory, 1TB SSD",
  },
  {
    id: "item-2",
    name: "JetBrains All Products Pack",
    sku: "IT-SW-JB-002",
    category: "software_license",
    quantity: 2,
    unitPrice: 289.0,
    billingFrequency: "annual",
    slaDays: 1,
  },
];

const sampleCostCenters = [
  "CC-4010 Engineering",
  "CC-1020 Finance",
];

describe("ServiceCatalogCartCheckout", () => {
  it("renders cart checkout header and items correctly", () => {
    render(
      <ServiceCatalogCartCheckout
        requestId="REQ-2026-9402"
        requesterName="Elena Rostova"
        requesterEmail="elena.rostova@unierp.internal"
        costCenters={sampleCostCenters}
        initialItems={sampleItems}
      />
    );

    expect(screen.getByText("REQ-2026-9402")).toBeDefined();
    expect(screen.getByText("Elena Rostova")).toBeDefined();
    expect(screen.getByText("MacBook Pro 16-inch M3 Max")).toBeDefined();
    expect(screen.getByText("JetBrains All Products Pack")).toBeDefined();
  });

  it("updates cost center and triggers submission callback", () => {
    const handleSubmit = vi.fn();

    render(
      <ServiceCatalogCartCheckout
        requestId="REQ-2026-9402"
        requesterName="Elena Rostova"
        requesterEmail="elena.rostova@unierp.internal"
        costCenters={sampleCostCenters}
        initialItems={sampleItems}
        onSubmitRequest={handleSubmit}
      />
    );

    const costCenterSelect = screen.getByLabelText(/Cost Center Allocation/i);
    fireEvent.change(costCenterSelect, { target: { value: "CC-1020 Finance" } });

    const justificationInput = screen.getByLabelText(/Business Justification/i);
    fireEvent.change(justificationInput, { target: { value: "Q3 Core Architecture Scaling" } });

    const submitBtn = screen.getByRole("button", { name: /Submit Provisioning Request/i });
    fireEvent.click(submitBtn);

    expect(handleSubmit).toHaveBeenCalledWith({
      costCenter: "CC-1020 Finance",
      businessJustification: "Q3 Core Architecture Scaling",
      items: sampleItems,
    });
  });

  it("removes an item from cart when remove button is clicked", () => {
    const handleRemove = vi.fn();

    render(
      <ServiceCatalogCartCheckout
        requestId="REQ-2026-9402"
        requesterName="Elena Rostova"
        requesterEmail="elena.rostova@unierp.internal"
        costCenters={sampleCostCenters}
        initialItems={sampleItems}
        onRemoveItem={handleRemove}
      />
    );

    const removeButtons = screen.getAllByRole("button", { name: /Remove/i });
    fireEvent.click(removeButtons[0]);

    expect(handleRemove).toHaveBeenCalledWith("item-1");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <ServiceCatalogCartCheckout
        requestId="REQ-2026-9402"
        requesterName="Elena Rostova"
        requesterEmail="elena.rostova@unierp.internal"
        costCenters={sampleCostCenters}
        initialItems={sampleItems}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
