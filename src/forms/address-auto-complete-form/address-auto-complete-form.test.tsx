import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { AddressAutoCompleteForm } from "./address-auto-complete-form";

const defaultProps = {} as any;

describe("AddressAutoCompleteForm", () => {
  it("renders without crashing", () => {
    render(<AddressAutoCompleteForm {...defaultProps} defaultCountry="US" />);
    expect(document.querySelector('[class*="container"]')).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<AddressAutoCompleteForm {...defaultProps} defaultCountry="US" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
