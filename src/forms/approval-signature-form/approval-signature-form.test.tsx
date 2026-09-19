import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { ApprovalSignatureForm } from "./approval-signature-form";

describe("ApprovalSignatureForm", () => {
  it("enables sign button only when terms agreed", () => {
    const onSign = vi.fn();
    render(
      <ApprovalSignatureForm
        signerName="Jane Doe"
        documentTitle="Invoice #9901"
        onSign={onSign}
      />
    );

    const signBtn = screen.getByRole("button", { name: "Sign & Approve" });
    expect(signBtn).toBeDisabled();

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    expect(signBtn).not.toBeDisabled();

    fireEvent.click(signBtn);
    expect(onSign).toHaveBeenCalledWith("Jane Doe");
  });

  it("handles rejection workflow", () => {
    const onReject = vi.fn();
    render(
      <ApprovalSignatureForm
        signerName="Jane Doe"
        documentTitle="Invoice #9901"
        onReject={onReject}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Reject..." }));
    expect(screen.getByLabelText(/Rejection Reason/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/Rejection Reason/i), {
      target: { value: "Pricing mismatch" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Confirm Rejection" }));
    expect(onReject).toHaveBeenCalledWith("Pricing mismatch");
  });

  it("forwards ref correctly to the region element", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <ApprovalSignatureForm
        ref={ref}
        signerName="Jane Doe"
        documentTitle="Invoice #9901"
      />
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute("role", "region");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <ApprovalSignatureForm
        signerName="John Smith"
        documentTitle="Purchase Order #PO-2026-0891"
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
