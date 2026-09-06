import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { RepeaterFieldGroup } from "./repeater-field-group";

const defaultProps = {} as any;

describe("RepeaterFieldGroup", () => {
  it("renders without crashing", () => {
    render(<RepeaterFieldGroup {...defaultProps} label="Line Items" fields={['Description', 'Qty', 'Unit Price', 'Amount']} />);
    expect(document.querySelector('[class*="container"]')).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<RepeaterFieldGroup {...defaultProps} label="Line Items" fields={['Description', 'Qty', 'Unit Price', 'Amount']} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
