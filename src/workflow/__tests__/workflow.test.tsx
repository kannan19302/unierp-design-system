import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ApprovalChain, type ApprovalStep } from "../approval-chain";
import { LifecycleTracker, type LifecycleStage } from "../lifecycle-tracker";

const testSteps: ApprovalStep[] = [
  {
    id: "step-1",
    title: "Direct Manager Approval",
    status: "approved",
    approvers: [
      { id: "u1", name: "Alice Smith", role: "Engineering Lead", status: "approved", comment: "Looks good!" },
    ],
  },
  {
    id: "step-2",
    title: "Finance Review",
    status: "pending",
    quorum: 2,
    slaDeadline: "Due in 4 hours",
    canApprove: true,
    approvers: [
      { id: "u2", name: "Bob Jones", role: "Financial Analyst", status: "approved" },
      { id: "u3", name: "Carol White", role: "CFO", status: "pending" },
    ],
  },
];

const testStages: LifecycleStage[] = [
  { id: "draft", name: "Draft", date: "Aug 20" },
  { id: "submitted", name: "Submitted", date: "Aug 22" },
  { id: "review", name: "Under Review" },
  { id: "approved", name: "Approved" },
];

describe("ApprovalChain", () => {
  it("renders approval steps, approver names, and quorum count", () => {
    render(<ApprovalChain steps={testSteps} />);

    expect(screen.getByText("Direct Manager Approval")).toBeInTheDocument();
    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    expect(screen.getByText("Looks good!")).toBeInTheDocument();
    expect(screen.getByText("Finance Review")).toBeInTheDocument();
    expect(screen.getByText("1/2 Approved")).toBeInTheDocument();
    expect(screen.getByText("Due in 4 hours")).toBeInTheDocument();
  });

  it("triggers onApprove and onReject action callbacks", async () => {
    const onApprove = vi.fn();
    const onReject = vi.fn();
    render(<ApprovalChain steps={testSteps} onApprove={onApprove} onReject={onReject} />);

    const approveBtn = screen.getByRole("button", { name: "Approve" });
    const rejectBtn = screen.getByRole("button", { name: "Reject" });

    await userEvent.click(approveBtn);
    expect(onApprove).toHaveBeenCalledWith("step-2");

    await userEvent.click(rejectBtn);
    expect(onReject).toHaveBeenCalledWith("step-2");
  });
});

describe("LifecycleTracker", () => {
  it("renders lifecycle stages and marks active step", () => {
    render(<LifecycleTracker stages={testStages} currentStageId="review" />);

    expect(screen.getByText("Draft")).toBeInTheDocument();
    expect(screen.getByText("Submitted")).toBeInTheDocument();
    expect(screen.getByText("Under Review")).toBeInTheDocument();
    expect(screen.getByText("Approved")).toBeInTheDocument();
  });

  it("calls onSelectStage when stage is clicked", async () => {
    const onSelect = vi.fn();
    render(<LifecycleTracker stages={testStages} currentStageId="review" onSelectStage={onSelect} />);

    await userEvent.click(screen.getByText("Approved"));
    expect(onSelect).toHaveBeenCalledWith("approved");
  });
});
