import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { BatchEntryForm } from "./batch-entry-form";

const defaultProps = {} as any;

describe("BatchEntryForm", () => {
  it("renders without crashing", () => {
    render(<BatchEntryForm {...defaultProps} columns={['Date', 'Description', 'Debit', 'Credit', 'Account']} />);
    expect(document.querySelector('[class*="container"]')).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<BatchEntryForm {...defaultProps} columns={['Date', 'Description', 'Debit', 'Credit', 'Account']} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
