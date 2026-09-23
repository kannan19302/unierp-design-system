import type { Meta, StoryObj } from "@storybook/react";
import { InboxNotificationStream } from "./inbox-notification-stream";

const SAMPLE_ITEMS = [
  {
    id: "1",
    title: "New Invoice Approved",
    body: "Invoice #INV-2026-0891 has been approved by John Smith.",
    timestamp: "2 min ago",
    read: false,
    icon: "✅",
  },
  {
    id: "2",
    title: "Deployment Complete",
    body: "Production deployment v3.2.1 completed successfully.",
    timestamp: "15 min ago",
    read: false,
    icon: "🚀",
  },
  {
    id: "3",
    title: "Password Expiring",
    body: "Your password will expire in 7 days.",
    timestamp: "1 hour ago",
    read: true,
    icon: "🔑",
  },
];

const meta: Meta<typeof InboxNotificationStream> = {
  title: "Core/Notifications/InboxNotificationStream",
  component: InboxNotificationStream,
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
type Story = StoryObj<typeof InboxNotificationStream>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 600, padding: "var(--space-4)" }}>
      <InboxNotificationStream items={SAMPLE_ITEMS} onMarkAllRead={() => {}} />
    </div>
  ),
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ width: 600, display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <InboxNotificationStream
        items={[
          {
            id: "tx-1",
            title: "Dual-Signoff Required",
            body: "Wire transfer #WT-9921 requires secondary approval.",
            timestamp: "Just now",
            read: false,
            icon: "🛡️",
          },
        ]}
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ width: 600, display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <InboxNotificationStream items={SAMPLE_ITEMS} />
    </div>
  ),
};
