import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { ApprovalSignatureForm } from "./approval-signature-form";

const defaultProps = {} as any;

describe("ApprovalSignatureForm", () => {
  it("renders without crashing", () => {
    render(<ApprovalSignatureForm {...defaultProps} signerName="John Smith" documentTitle="Purchase Order #PO-2026-0891" />);
    expect(document.querySelector('[class*="container"]')).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<ApprovalSignatureForm {...defaultProps} signerName="John Smith" documentTitle="Purchase Order #PO-2026-0891" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
