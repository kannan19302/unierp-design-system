import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import React from "react";
import { RfiSubmissionWorkflow } from "./rfi-submission-workflow";

describe("RfiSubmissionWorkflow", () => {
  const defaultProps = {
    rfiNumber: "RFI-2026-089",
    projectTitle: "Hudson Yards Tower C",
    discipline: "Structural Steel",
    subject: "Foundation slab anchor bolt conflict",
    questionDetails: "Discrepancy at pier C-4 requires immediate engineering clarification.",
    assignedReviewer: "Thornton Tomasetti",
    coordinatingContractor: "Turner Construction",
    costImpactEstimate: 14500,
    scheduleImpactDays: 3,
    status: "in_review" as const,
    onAddComment: vi.fn(),
  };

  it("renders RFI header, subject, and impacts", () => {
    render(<RfiSubmissionWorkflow {...defaultProps} />);
    expect(screen.getByText("RFI-2026-089")).toBeDefined();
    expect(screen.getByText("Structural Steel")).toBeDefined();
    expect(screen.getByRole("heading", { name: /Foundation slab anchor bolt conflict/i })).toBeDefined();
    expect(screen.getByText("+3 days")).toBeDefined();
  });

  it("calls onAddComment when submitting clarification note", () => {
    const handleComment = vi.fn();
    render(<RfiSubmissionWorkflow {...defaultProps} onAddComment={handleComment} />);
    const commentInput = screen.getByPlaceholderText(/Add clarification note.../i);
    fireEvent.change(commentInput, { target: { value: "Inspection team arrived on site." } });
    const postBtn = screen.getByRole("button", { name: /post/i });
    fireEvent.click(postBtn);
    expect(handleComment).toHaveBeenCalledWith("Inspection team arrived on site.");
  });

  it("renders answered status and calls onCloseRfi when closed", () => {
    const handleClose = vi.fn();
    render(
      <RfiSubmissionWorkflow
        {...defaultProps}
        status="answered"
        officialResponse="Approved per amended shop drawing SK-104."
        responseAuthor="Elena Rostova, PE"
        onCloseRfi={handleClose}
      />
    );
    expect(screen.getByText("Approved per amended shop drawing SK-104.")).toBeDefined();
    const closeBtn = screen.getByRole("button", { name: /acknowledge & close rfi/i });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalled();
  });

  it("passes accessibility axe audit", async () => {
    const { container } = render(<RfiSubmissionWorkflow {...defaultProps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
