import type { Meta, StoryObj } from "@storybook/react";
import { AlertBanner } from "./alert-banner";

const meta: Meta<typeof AlertBanner> = {
  title: "Core/Notifications/AlertBanner",
  component: AlertBanner,
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
type Story = StoryObj<typeof AlertBanner>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 600, padding: "var(--space-4)" }}>
      <AlertBanner
        variant="warning"
        title="Scheduled Maintenance"
        message="The system will be unavailable on Sept 7, 2026 from 2:00 AM - 4:00 AM UTC."
        action={{ label: "Learn More", onClick: () => {} }}
      />
    </div>
  ),
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ width: 600, display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <AlertBanner
        variant="info"
        title="Security Compliance Refresh"
        message="SOC-2 Type II audit logs have been generated and archived for Q3."
        action={{ label: "View Audit Log", onClick: () => {} }}
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ width: 600, display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
      <AlertBanner
        variant="info"
        title="Information Notice"
        message="System update 2.4.0 is now live across all nodes."
      />
      <AlertBanner
        variant="success"
        title="Transaction Completed"
        message="Wire transfer batch of 24 items settled successfully."
      />
      <AlertBanner
        variant="warning"
        title="High Memory Pressure"
        message="Worker thread queue is above 85% utilization."
      />
      <AlertBanner
        variant="error"
        title="Payment Gateway Timeout"
        message="Unable to reach Stripe Connect webhooks."
      />
    </div>
  ),
};
