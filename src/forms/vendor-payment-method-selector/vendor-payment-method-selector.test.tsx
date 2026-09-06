import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import React from "react";
import { VendorPaymentMethodSelector } from "./vendor-payment-method-selector";

describe("VendorPaymentMethodSelector", () => {
  const defaultProps = {
    vendorName: "Apex Industrial Automation LLC",
    vendorTaxId: "XX-XXX4910",
    w9Status: "verified" as const,
    initialRail: "ACH" as const,
    onSelectRail: vi.fn(),
    onSavePaymentMethod: vi.fn(),
  };

  it("renders vendor header, tax status, and payment rail cards", () => {
    render(<VendorPaymentMethodSelector {...defaultProps} />);
    expect(
      screen.getByRole("heading", {
        name: /Disbursement Rail & Banking Configuration: Apex Industrial Automation LLC/i,
      })
    ).toBeDefined();
    expect(screen.getByText("Tax ID: XX-XXX4910")).toBeDefined();
    expect(screen.getByText("Direct Deposit (ACH)")).toBeDefined();
    expect(screen.getByText("Virtual Commercial Card")).toBeDefined();
  });

  it("switches rail to Virtual Commercial Card on click", () => {
    const handleSelect = vi.fn();
    render(<VendorPaymentMethodSelector {...defaultProps} onSelectRail={handleSelect} />);
    const cardOption = screen.getByText("Virtual Commercial Card");
    fireEvent.click(cardOption);
    expect(handleSelect).toHaveBeenCalledWith("CARD");
    expect(screen.getByLabelText(/Accounts Receivable Remittance Email/i)).toBeDefined();
  });

  it("calls onSavePaymentMethod when clicking confirm button", () => {
    const handleSave = vi.fn();
    render(<VendorPaymentMethodSelector {...defaultProps} onSavePaymentMethod={handleSave} />);
    const saveBtn = screen.getByRole("button", { name: /confirm & save payment rail/i });
    fireEvent.click(saveBtn);
    expect(handleSave).toHaveBeenCalled();
  });

  it("passes accessibility axe audit", async () => {
    const { container } = render(<VendorPaymentMethodSelector {...defaultProps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
