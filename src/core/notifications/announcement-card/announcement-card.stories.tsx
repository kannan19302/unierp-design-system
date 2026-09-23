import type { Meta, StoryObj } from "@storybook/react";
import { AnnouncementCard } from "./announcement-card";

const meta: Meta<typeof AnnouncementCard> = {
  title: "Core/Notifications/AnnouncementCard",
  component: AnnouncementCard,
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
type Story = StoryObj<typeof AnnouncementCard>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 600, padding: "var(--space-4)" }}>
      <AnnouncementCard
        title="🎉 New Feature: AI Copilot"
        body="Our new AI assistant can help you draft invoices, analyze spending patterns, and automate repetitive tasks."
        ctaLabel="Try It Now"
        variant="feature"
        onCtaClick={() => {}}
        onDismiss={() => {}}
      />
    </div>
  ),
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ width: 600, display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <AnnouncementCard
        title="Global Tax Engine 2026 Ready"
        body="Automated real-time VAT calculation for cross-border transactions across 140+ countries."
        ctaLabel="Explore Tax Rules"
        variant="update"
        onCtaClick={() => {}}
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ width: 600, display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <AnnouncementCard
        title="System Maintenance Window"
        body="Scheduled infrastructure maintenance on Saturday at 02:00 UTC."
        variant="info"
      />
      <AnnouncementCard
        title="Smart Reconciliation Engine"
        body="Bank statement auto-matching algorithms with 99.4% accuracy."
        variant="feature"
        ctaLabel="Enable Feature"
      />
      <AnnouncementCard
        title="New Regulatory Compliance Module"
        body="Updated reporting pipelines conforming to IFRS 17 guidelines."
        variant="update"
        onDismiss={() => {}}
      />
    </div>
  ),
};
