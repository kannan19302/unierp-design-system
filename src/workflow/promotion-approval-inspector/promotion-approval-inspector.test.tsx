import { createRef } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { PromotionApprovalInspector } from "./promotion-approval-inspector";

describe("PromotionApprovalInspector Component", () => {
  it("renders reviewer identity and handles approval with notes", () => {
    const onApprove = vi.fn();
    const onReject = vi.fn();

    render(
      <PromotionApprovalInspector
        releaseVersion="v1.0"
        targetEnvironment="Production"
        author="author@acme.com"
        currentReviewer="reviewer@acme.com"
        onApprove={onApprove}
        onReject={onReject}
      />
    );

    expect(screen.getByText(/Promoting v1.0 to Production/)).toBeInTheDocument();
    expect(screen.getByText("author@acme.com")).toBeInTheDocument();

    const textarea = screen.getByLabelText("Approval Audit Notes");
    fireEvent.change(textarea, { target: { value: "All gates passed cleanly." } });

    const approveBtn = screen.getByRole("button", { name: "Approve and deploy release" });
    fireEvent.click(approveBtn);
    expect(onApprove).toHaveBeenCalledWith("All gates passed cleanly.");
  });

  it("disables approve button and shows warning if author is the reviewer", () => {
    render(
      <PromotionApprovalInspector
        releaseVersion="v1.0"
        targetEnvironment="Production"
        author="same.user@acme.com"
        currentReviewer="same.user@acme.com"
        onApprove={() => {}}
        onReject={() => {}}
      />
    );

    expect(screen.getByText("Separation of Duties Enforced")).toBeInTheDocument();
    const approveBtn = screen.getByRole("button", { name: "Approve and deploy release" });
    expect(approveBtn).toBeDisabled();
  });

  it("forwards ref to outer container element", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <PromotionApprovalInspector
        ref={ref}
        releaseVersion="v1.0"
        targetEnvironment="Prod"
        author="a@b.com"
        currentReviewer="c@d.com"
        onApprove={() => {}}
        onReject={() => {}}
      />
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <PromotionApprovalInspector
        releaseVersion="v1.0"
        targetEnvironment="Production"
        author="author@acme.com"
        currentReviewer="reviewer@acme.com"
        onApprove={() => {}}
        onReject={() => {}}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
