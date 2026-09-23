import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { NotificationCenter, type NotificationItem } from "./notification-center";
import { Button } from "../../primitives/button";

const meta: Meta<typeof NotificationCenter> = {
  title: "Core/Feedback/NotificationCenter",
  component: NotificationCenter,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    a11y: {
      config: {
        rules: [{ id: "color-contrast", enabled: true }],
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof NotificationCenter>;

const sampleNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Urgent: Direct Approval Required",
    message: "Purchase Requisition #901 exceeds branch threshold ($50,000.00).",
    timestamp: "10:15 AM",
    unread: true,
    priority: "urgent",
    category: "approval",
    actionLabel: "Review Requisition",
  },
  {
    id: "notif-2",
    title: "Quarterly Tax Return Generated",
    message: "Q2 corporate tax statement is compiled and ready for review.",
    timestamp: "Yesterday",
    unread: true,
    priority: "normal",
    category: "system",
    actionLabel: "Download PDF",
  },
  {
    id: "notif-3",
    title: "Security: New API Key Provisioned",
    message: "Integration token created by user admin@acme.corp from 192.168.1.10.",
    timestamp: "Aug 26",
    unread: false,
    priority: "high",
    category: "security",
  },
];

export const InteractiveDrawer: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    const [notifications, setNotifications] = useState(sampleNotifications);

    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <Button variant="primary" onClick={() => setOpen(true)}>
          Open Notification Drawer
        </Button>
        <NotificationCenter
          isOpen={open}
          onClose={() => setOpen(false)}
          notifications={notifications}
          onMarkAsRead={(id) => {
            setNotifications((prev) =>
              prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
            );
          }}
          onMarkAllAsRead={() => {
            setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
          }}
          onClearAll={() => setNotifications([])}
        />
      </div>
    );
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ position: "relative", minHeight: "500px", width: "100%" }}>
      <NotificationCenter
        isOpen={true}
        onClose={() => {}}
        notifications={sampleNotifications}
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div style={{ position: "relative", minHeight: "450px" }}>
        <NotificationCenter
          isOpen={true}
          onClose={() => {}}
          notifications={sampleNotifications.filter((n) => n.unread)}
        />
      </div>
    </div>
  ),
};
