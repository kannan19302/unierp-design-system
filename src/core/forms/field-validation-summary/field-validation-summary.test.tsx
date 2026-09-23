import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { FieldValidationSummary } from "./field-validation-summary";

const defaultProps = {} as any;

describe("FieldValidationSummary", () => {
  it("renders without crashing", () => {
    render(<FieldValidationSummary {...defaultProps} errors={[{ fieldKey: 'email', fieldLabel: 'Email', message: 'Email address is required' }, { fieldKey: 'amount', fieldLabel: 'Amount', message: 'Must be greater than 0' }, { fieldKey: 'date', fieldLabel: 'Due Date', message: 'Date cannot be in the past' }]} />);
    expect(document.querySelector('[class*="container"]')).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<FieldValidationSummary {...defaultProps} errors={[{ fieldKey: 'email', fieldLabel: 'Email', message: 'Email address is required' }, { fieldKey: 'amount', fieldLabel: 'Amount', message: 'Must be greater than 0' }, { fieldKey: 'date', fieldLabel: 'Due Date', message: 'Date cannot be in the past' }]} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
