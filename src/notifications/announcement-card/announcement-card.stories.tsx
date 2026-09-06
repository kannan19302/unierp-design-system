import type { Meta, StoryObj } from "@storybook/react";
import { AnnouncementCard } from "./announcement-card";

const meta: Meta<typeof AnnouncementCard> = {
  title: "Notifications/AnnouncementCard",
  component: AnnouncementCard,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof AnnouncementCard>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 600, padding: "var(--space-4)" }}>
      <AnnouncementCard title="🎉 New Feature: AI Copilot" body="Our new AI assistant can help you draft invoices, analyze spending patterns, and automate repetitive tasks." ctaLabel="Try It Now" variant="feature" onCtaClick={() => {}} onDismiss={() => {}} />
    </div>
  ),
};
