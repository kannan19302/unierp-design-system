import React, { createRef } from "react";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { MultiStepTransactionForm } from "./multi-step-transaction-form";

const sampleSteps = [
  { id: "details", label: "Details", content: <div>Step 1: Enter transaction details</div> },
  { id: "review", label: "Review", content: <div>Step 2: Review information</div> },
  { id: "confirm", label: "Confirm", content: <div>Step 3: Confirm and submit</div> },
];

describe("MultiStepTransactionForm", () => {
  it("renders without crashing", () => {
    render(<MultiStepTransactionForm steps={sampleSteps} />);
    expect(document.querySelector('[class*="container"]')).toBeInTheDocument();
  });

  it("forwards ref correctly to container element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<MultiStepTransactionForm ref={ref} steps={sampleSteps} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<MultiStepTransactionForm steps={sampleSteps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
