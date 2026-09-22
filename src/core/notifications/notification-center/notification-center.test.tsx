import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { NotificationCenter, type NotificationItem } from "../notification-center";

const testNotifications: NotificationItem[] = [
  {
    id: "n-1",
    title: "New Approval Required",
    message: "Purchase Order #842 requires your direct sign-off.",
    timestamp: "10:15 AM",
    unread: true,
    priority: "urgent",
    category: "approval",
    actionLabel: "Review PO",
  },
  {
    id: "n-2",
    title: "Security Update",
    message: "Two-factor authentication policy updated for tenant.",
    timestamp: "Yesterday",
    unread: false,
    priority: "normal",
    category: "security",
  },
];

describe("NotificationCenter", () => {
  it("does not render when isOpen is false", () => {
    const { container } = render(
      <NotificationCenter isOpen={false} onClose={vi.fn()} notifications={testNotifications} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders notification items and unread badge when open", () => {
    render(
      <NotificationCenter isOpen={true} onClose={vi.fn()} notifications={testNotifications} />
    );

    expect(screen.getByText("Notifications")).toBeInTheDocument();
    expect(screen.getByText("New Approval Required")).toBeInTheDocument();
    expect(screen.getByText("Security Update")).toBeInTheDocument();
    expect(screen.getByText("urgent")).toBeInTheDocument();
  });

  it("filters by category tabs", async () => {
    render(
      <NotificationCenter isOpen={true} onClose={vi.fn()} notifications={testNotifications} />
    );

    // Click 'Unread' tab
    const unreadTab = screen.getByText(/Unread/);
    await userEvent.click(unreadTab);

    expect(screen.getByText("New Approval Required")).toBeInTheDocument();
    expect(screen.queryByText("Security Update")).not.toBeInTheDocument();
  });

  it("triggers close on close button click", async () => {
    const onClose = vi.fn();
    render(
      <NotificationCenter isOpen={true} onClose={onClose} notifications={testNotifications} />
    );

    const closeBtn = screen.getByLabelText("Close notification drawer");
    await userEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
