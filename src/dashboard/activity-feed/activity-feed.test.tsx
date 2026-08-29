import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ActivityFeed, type ActivityItem } from "../activity-feed";

const testItems: ActivityItem[] = [
  {
    id: "act-1",
    actor: { id: "u1", name: "David Miller", role: "Auditor" },
    action: "UPDATE",
    entityType: "Invoice",
    entityId: "INV-1002",
    summary: "Updated tax rate from 5% to 8%",
    timestamp: "10:42 AM",
    diffs: [{ field: "Tax Rate", oldValue: "5%", newValue: "8%" }],
  },
  {
    id: "act-2",
    actor: { id: "u2", name: "Sarah Connor" },
    action: "APPROVE",
    entityType: "PurchaseOrder",
    entityId: "PO-882",
    summary: "Approved purchase requisition for Q3 hardware",
    timestamp: "09:15 AM",
  },
];

describe("ActivityFeed", () => {
  it("renders activity items with actor names and action badges", () => {
    render(<ActivityFeed items={testItems} />);

    expect(screen.getByText("David Miller")).toBeInTheDocument();
    expect(screen.getByText("UPDATE")).toBeInTheDocument();
    expect(screen.getByText("Updated tax rate from 5% to 8%")).toBeInTheDocument();
    expect(screen.getByText("Sarah Connor")).toBeInTheDocument();
    expect(screen.getByText("APPROVE")).toBeInTheDocument();
  });

  it("toggles field diff comparison panel", async () => {
    render(<ActivityFeed items={testItems} />);

    const toggleBtn = screen.getByText("View 1 field change(s)");
    expect(screen.queryByText("Tax Rate:")).not.toBeInTheDocument();

    await userEvent.click(toggleBtn);
    expect(screen.getByText("Tax Rate:")).toBeInTheDocument();
    expect(screen.getByText("5%")).toBeInTheDocument();
    expect(screen.getByText("8%")).toBeInTheDocument();
  });
});
