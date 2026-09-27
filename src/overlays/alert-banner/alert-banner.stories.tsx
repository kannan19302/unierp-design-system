import type { Meta, StoryObj } from "@storybook/react";
import { AlertBanner } from "./alert-banner";

const meta: Meta<typeof AlertBanner> = {
  title: "Overlays/AlertBanner",
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
  argTypes: {
    variant: {
      control: "select",
      options: ["info", "warning", "error", "success"],
    },
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof AlertBanner>;

export const Default: Story = {
  render: () => (
    <div style={{ inlineSize: 600, padding: "var(--space-4)" }}>
      <AlertBanner
        variant="warning"
        title="Scheduled Maintenance"
        message="The system will be unavailable on Sept 7, 2026 from 2:00 AM - 4:00 AM UTC."
        action={{ label: "Learn More", onClick: () => {} }}
      />
    </div>
  ),
};

export const Densities: Story = {
  render: () => (
    <div style={{ inlineSize: 600, display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
      <AlertBanner
        density="ultra-compact"
        variant="info"
        title="Ultra-compact (24px target)"
        message="Density optimized for high-throughput ERP workspace toolbars."
      />
      <AlertBanner
        density="compact"
        variant="info"
        title="Compact (28px target)"
        message="Dense desktop table inline notification."
      />
      <AlertBanner
        density="standard"
        variant="info"
        title="Standard (32px target)"
        message="Balanced density for standard transactional pages."
      />
      <AlertBanner
        density="comfortable"
        variant="info"
        title="Comfortable (40px target)"
        message="Spacious layout for onboarding and settings overviews."
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ inlineSize: 600, display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
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
