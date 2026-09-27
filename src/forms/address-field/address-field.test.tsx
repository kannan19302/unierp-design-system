import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { AddressAutoCompleteForm, AddressField } from "./address-field";

describe("AddressAutoCompleteForm", () => {
  it("renders form fields and handles submit", () => {
    const onSubmit = vi.fn();
    render(
      <AddressAutoCompleteForm
        title="Shipping Address"
        defaultCountry="US"
        onSubmit={onSubmit}
      />
    );

    expect(screen.getByRole("region", { name: "Shipping Address" })).toBeInTheDocument();
    expect(screen.getByLabelText("Address Line 1")).toBeInTheDocument();
    expect(screen.getByLabelText("City")).toBeInTheDocument();
    expect(screen.getByLabelText("State / Province")).toBeInTheDocument();
    expect(screen.getByLabelText("Postal Code")).toBeInTheDocument();
    expect(screen.getByLabelText("Country / Region")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Address Line 1"), {
      target: { value: "100 Market St" },
    });
    fireEvent.change(screen.getByLabelText("City"), {
      target: { value: "San Francisco" },
    });
    fireEvent.change(screen.getByLabelText("State / Province"), {
      target: { value: "CA" },
    });
    fireEvent.change(screen.getByLabelText("Postal Code"), {
      target: { value: "94105" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Save Address" }));

    expect(onSubmit).toHaveBeenCalledWith({
      line1: "100 Market St",
      line2: "",
      city: "San Francisco",
      state: "CA",
      postalCode: "94105",
      country: "US",
    });
  });

  it("forwards ref correctly to the container element", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<AddressAutoCompleteForm ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute("role", "region");
  });

  it("renders with data-slot attributes", () => {
    const { container } = render(
      <AddressAutoCompleteForm
        title="Warehouse Location"
        subtitle="Primary storage facility"
        suggestions={["100 Main St"]}
      />
    );
    expect(container.querySelector('[data-slot="address-field"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="address-field-header"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="address-field-title"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="address-field-subtitle"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="address-field-form"]')).toBeInTheDocument();
    expect(container.querySelectorAll('[data-slot="address-field-group"]').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('[data-slot="address-field-label"]').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('[data-slot="address-field-input"]').length).toBeGreaterThan(0);
    expect(container.querySelector('[data-slot="address-field-select"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="address-field-submit"]')).toBeInTheDocument();
  });

  it("supports 4-tier density scaling", () => {
    const densities = ["ultra-compact", "compact", "standard", "comfortable"] as const;
    densities.forEach((density) => {
      const { unmount } = render(<AddressAutoCompleteForm density={density} title={`Address ${density}`} />);
      const el = screen.getByRole("region", { name: `Address ${density}` });
      expect(el).toHaveAttribute("data-density", density);
      unmount();
    });
  });

  it("exports AddressField alias which behaves identically", () => {
    render(<AddressField title="Alias Test" />);
    expect(screen.getByRole("region", { name: "Alias Test" })).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<AddressAutoCompleteForm defaultCountry="US" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
