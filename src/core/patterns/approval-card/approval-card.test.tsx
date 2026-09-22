import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { ApprovalCard } from "./approval-card";

describe("ApprovalCard Component", () => {
  it("renders article role with title and requester", () => {
    render(<ApprovalCard requestTitle="Vendor PO #991" requesterName="John Doe" />);
    expect(screen.getByRole("article")).toBeInTheDocument();
    expect(screen.getByText("Vendor PO #991")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("calls onApprove when approve button is clicked", () => {
    const onApprove = vi.fn();
    render(<ApprovalCard onApprove={onApprove} />);
    const approveBtn = screen.getByRole("button", { name: /approve & sign/i });
    fireEvent.click(approveBtn);
    expect(onApprove).toHaveBeenCalled();
  });

  it("calls onReject when reject button is clicked", () => {
    const onReject = vi.fn();
    render(<ApprovalCard onReject={onReject} />);
    const rejectBtn = screen.getByRole("button", { name: /reject request/i });
    fireEvent.click(rejectBtn);
    expect(onReject).toHaveBeenCalled();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<ApprovalCard />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
