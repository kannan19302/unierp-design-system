import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { ApprovalChain, type ApprovalStep } from "./approval-chain";

const MOCK_STEPS: ApprovalStep[] = [
  {
    id: "step-1",
    title: "Finance Review",
    description: "Verify tax computation",
    status: "approved",
    approvers: [
      { id: "u-1", name: "Alice Chen", role: "CFO", status: "approved" },
    ],
  },
  {
    id: "step-2",
    title: "Legal Signoff",
    status: "pending",
    canApprove: true,
    approvers: [
      { id: "u-2", name: "Bob Smith", role: "Counsel", status: "pending" },
    ],
  },
];

describe("ApprovalChain Primitive", () => {
  it("renders approval steps and triggers action callbacks", () => {
    const onApprove = vi.fn();
    const onReject = vi.fn();
    const onDelegate = vi.fn();

    render(
      <ApprovalChain
        steps={MOCK_STEPS}
        onApprove={onApprove}
        onReject={onReject}
        onDelegate={onDelegate}
      />
    );

    expect(screen.getByText("Finance Review")).toBeInTheDocument();
    expect(screen.getByText("Legal Signoff")).toBeInTheDocument();
    expect(screen.getByText("Alice Chen")).toBeInTheDocument();

    const approveButton = screen.getByRole("button", { name: /approve/i });
    fireEvent.click(approveButton);
    expect(onApprove).toHaveBeenCalledWith("step-2");

    const rejectButton = screen.getByRole("button", { name: /reject/i });
    fireEvent.click(rejectButton);
    expect(onReject).toHaveBeenCalledWith("step-2");

    const delegateButton = screen.getByRole("button", { name: /delegate/i });
    fireEvent.click(delegateButton);
    expect(onDelegate).toHaveBeenCalledWith("step-2");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<ApprovalChain steps={MOCK_STEPS} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
