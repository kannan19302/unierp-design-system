import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import React from "react";
import { EnterpriseCheckoutAddressValidator } from "./enterprise-checkout-address-validator";

describe("EnterpriseCheckoutAddressValidator", () => {
  it("renders address form inputs and validation button", () => {
    render(<EnterpriseCheckoutAddressValidator />);

    expect(screen.getByText("Commercial Delivery Point Address Normalization")).toBeDefined();
    expect(screen.getByLabelText(/Delivery Street Address/i)).toBeDefined();
    expect(screen.getByRole("button", { name: /Verify & Standardize Address/i })).toBeDefined();
  });

  it("shows postal standardization suggestion and confirms standardized address", () => {
    const handleConfirm = vi.fn();

    render(
      <EnterpriseCheckoutAddressValidator onConfirmAddress={handleConfirm} />
    );

    const verifyBtn = screen.getByRole("button", { name: /Verify & Standardize Address/i });
    fireEvent.click(verifyBtn);

    expect(screen.getByText("Postal Standardization Match Found")).toBeDefined();

    const acceptBtn = screen.getByRole("button", {
      name: /Use Standardized Address \(Recommended\)/i,
    });
    fireEvent.click(acceptBtn);

    expect(handleConfirm).toHaveBeenCalled();
    expect(screen.getByText("Address Verified & Confirmed")).toBeDefined();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<EnterpriseCheckoutAddressValidator />);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
