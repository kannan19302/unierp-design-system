import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { ActivityWorkLogStream, WorkLogEntry } from "./activity-work-log-stream";

const TEST_ENTRIES: WorkLogEntry[] = [
  {
    id: "e1",
    type: "internal_note",
    authorName: "John Doe",
    authorRole: "SRE",
    createdAt: "10:00 AM",
    content: "Internal note regarding replica lag.",
  },
  {
    id: "e2",
    type: "customer_reply",
    authorName: "Jane Smith",
    authorRole: "Support",
    createdAt: "10:15 AM",
    content: "Customer update sent via email.",
  },
  {
    id: "e3",
    type: "system_audit",
    authorName: "Audit Bot",
    createdAt: "10:20 AM",
    content: "Workflow stage transitioned to Review.",
  },
];

describe("ActivityWorkLogStream", () => {
  it("renders entries with zero accessibility violations", async () => {
    const handleSubmit = vi.fn();
    const { container } = render(
      <ActivityWorkLogStream
        entries={TEST_ENTRIES}
        onSubmitEntry={handleSubmit}
        currentUser={{ name: "Tester" }}
      />
    );

    expect(screen.getByText("Activity & Work Log")).toBeInTheDocument();
    expect(screen.getByText("Internal note regarding replica lag.")).toBeInTheDocument();
    expect(screen.getByText("Customer update sent via email.")).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("filters entries according to selected tab", () => {
    render(
      <ActivityWorkLogStream
        entries={TEST_ENTRIES}
      />
    );

    const internalTab = screen.getByRole("tab", { name: /Internal Notes/i });
    fireEvent.click(internalTab);

    expect(screen.getByText("Internal note regarding replica lag.")).toBeInTheDocument();
    expect(screen.queryByText("Customer update sent via email.")).not.toBeInTheDocument();
    expect(screen.queryByText("Workflow stage transitioned to Review.")).not.toBeInTheDocument();
  });

  it("submits a new internal note entry", () => {
    const handleSubmit = vi.fn();
    render(
      <ActivityWorkLogStream
        entries={TEST_ENTRIES}
        onSubmitEntry={handleSubmit}
      />
    );

    const textarea = screen.getByPlaceholderText(/Add internal note/i);
    fireEvent.change(textarea, { target: { value: "Investigated cache miss." } });

    const submitBtn = screen.getByRole("button", { name: /Post Work Note/i });
    fireEvent.click(submitBtn);

    expect(handleSubmit).toHaveBeenCalledWith({
      type: "internal_note",
      content: "Investigated cache miss.",
    });
  });

  it("switches to customer reply mode and updates styling/actions", () => {
    const handleSubmit = vi.fn();
    render(
      <ActivityWorkLogStream
        entries={TEST_ENTRIES}
        onSubmitEntry={handleSubmit}
      />
    );

    const customerModeBtn = screen.getByRole("button", { name: /Customer Visible Reply/i });
    fireEvent.click(customerModeBtn);

    const textarea = screen.getByPlaceholderText(/Type response to send to customer contact/i);
    fireEvent.change(textarea, { target: { value: "We resolved the issue." } });

    const submitBtn = screen.getByRole("button", { name: /Send Customer Reply/i });
    fireEvent.click(submitBtn);

    expect(handleSubmit).toHaveBeenCalledWith({
      type: "customer_reply",
      content: "We resolved the issue.",
    });
  });
});
