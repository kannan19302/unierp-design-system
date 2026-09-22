import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { ApprovalTimeline, AuditTrailPanel } from "./audit-trail";

describe("AuditTrail & Approval Primitive", () => {
  it("renders approval steps with status", () => {
    render(
      <ApprovalTimeline
        steps={[
          { id: "1", approver: "Alice", status: "approved", timestamp: "Today" },
          { id: "2", approver: "Bob", status: "pending" },
        ]}
      />
    );
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("approved")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("renders audit trail logs", () => {
    render(
      <AuditTrailPanel
        logs={[{ id: "1", user: "Admin", action: "Deleted record", time: "12:00" }]}
      />
    );
    expect(screen.getByText("Audit Trail & Verification")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(screen.getByText("Deleted record")).toBeInTheDocument();
  });

  it("forwards ref to container elements", () => {
    const timelineRef = createRef<HTMLDivElement>();
    const panelRef = createRef<HTMLDivElement>();

    render(
      <div>
        <ApprovalTimeline
          ref={timelineRef}
          steps={[{ id: "1", approver: "Carol", status: "approved" }]}
        />
        <AuditTrailPanel
          ref={panelRef}
          logs={[{ id: "1", user: "Admin", action: "Deleted record", time: "12:00" }]}
        />
      </div>
    );

    expect(timelineRef.current).toBeInstanceOf(HTMLDivElement);
    expect(panelRef.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <ApprovalTimeline
        steps={[{ id: "1", approver: "Carol", status: "approved" }]}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
