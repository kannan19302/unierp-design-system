import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { MultiStepTransactionForm } from "./multi-step-transaction-form";

const defaultProps = {} as any;

describe("MultiStepTransactionForm", () => {
  it("renders without crashing", () => {
    render(<MultiStepTransactionForm {...defaultProps} steps={[{ id: 'details', label: 'Details', content: <div>Step 1: Enter transaction details</div> }, { id: 'review', label: 'Review', content: <div>Step 2: Review information</div> }, { id: 'confirm', label: 'Confirm', content: <div>Step 3: Confirm and submit</div> }]} />);
    expect(document.querySelector('[class*="container"]')).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<MultiStepTransactionForm {...defaultProps} steps={[{ id: 'details', label: 'Details', content: <div>Step 1: Enter transaction details</div> }, { id: 'review', label: 'Review', content: <div>Step 2: Review information</div> }, { id: 'confirm', label: 'Confirm', content: <div>Step 3: Confirm and submit</div> }]} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
