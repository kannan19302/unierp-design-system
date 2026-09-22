import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { CalculatedFieldDisplay } from "./calculated-field-display";

const defaultProps = {} as any;

describe("CalculatedFieldDisplay", () => {
  it("renders without crashing", () => {
    render(<CalculatedFieldDisplay {...defaultProps} label="Grand Total" formula="Subtotal + Tax - Discount" value="$1,247.50" breakdown={[{ label: 'Subtotal', value: '$1,200.00' }, { label: 'Tax (8.25%)', value: '$99.00' }, { label: 'Discount', value: '-$51.50' }]} />);
    expect(document.querySelector('[class*="container"]')).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<CalculatedFieldDisplay {...defaultProps} label="Grand Total" formula="Subtotal + Tax - Discount" value="$1,247.50" breakdown={[{ label: 'Subtotal', value: '$1,200.00' }, { label: 'Tax (8.25%)', value: '$99.00' }, { label: 'Discount', value: '-$51.50' }]} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
