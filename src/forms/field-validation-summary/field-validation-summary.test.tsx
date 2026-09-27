import React, { createRef } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { FieldValidationSummary } from "./field-validation-summary";

const MOCK_ERRORS = [
  { fieldKey: "email", fieldLabel: "Email", message: "Email address is required" },
  { fieldKey: "amount", fieldLabel: "Amount", message: "Must be greater than 0" },
  { fieldKey: "date", fieldLabel: "Due Date", message: "Date cannot be in the past" },
];

describe("FieldValidationSummary", () => {
  it("renders validation errors and handles click", () => {
    const onErrorClick = vi.fn();
    render(
      <FieldValidationSummary
        errors={MOCK_ERRORS}
        onErrorClick={onErrorClick}
      />
    );

    expect(screen.getByRole("alert", { name: "Validation errors" })).toBeInTheDocument();
    expect(screen.getByText("3 validation errors")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Email"));
    expect(onErrorClick).toHaveBeenCalledWith("email");
  });

  it("returns null when errors array is empty", () => {
    const { container } = render(<FieldValidationSummary errors={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("forwards ref correctly", () => {
    const ref = createRef<HTMLDivElement>();
    render(<FieldValidationSummary ref={ref} errors={MOCK_ERRORS} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute("role", "alert");
  });

  it("renders with data-slot attributes", () => {
    const { container } = render(<FieldValidationSummary errors={MOCK_ERRORS} />);
    expect(container.querySelector('[data-slot="field-validation-summary"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="field-validation-summary-title"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="field-validation-summary-list"]')).toBeInTheDocument();
    expect(container.querySelectorAll('[data-slot="field-validation-summary-item"]').length).toBe(3);
    expect(container.querySelectorAll('[data-slot="field-validation-summary-link"]').length).toBe(3);
    expect(container.querySelectorAll('[data-slot="field-validation-summary-message"]').length).toBe(3);
  });

  it("supports 4-tier density scaling", () => {
    const densities = ["ultra-compact", "compact", "standard", "comfortable"] as const;
    densities.forEach((density) => {
      const { container, unmount } = render(
        <FieldValidationSummary density={density} errors={MOCK_ERRORS} />
      );
      const root = container.querySelector('[data-slot="field-validation-summary"]');
      expect(root).toHaveAttribute("data-density", density);
      unmount();
    });
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<FieldValidationSummary errors={MOCK_ERRORS} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
