import type { Meta, StoryObj } from "@storybook/react";
import { SystemStatusBar } from "./system-status-bar";

const meta: Meta<typeof SystemStatusBar> = {
  title: "Notifications/SystemStatusBar",
  component: SystemStatusBar,
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
type Story = StoryObj<typeof SystemStatusBar>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 600, padding: "var(--space-4)" }}>
      <SystemStatusBar status="operational" lastChecked="30s ago" />
    </div>
  ),
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ width: 600, display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <SystemStatusBar
        status="degraded"
        message="High response time in us-east-1 RDS cluster"
        lastChecked="Just now"
        incidentUrl="https://status.unierp.com/incidents/inc-4892"
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ width: 600, display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
      <SystemStatusBar status="operational" lastChecked="1 min ago" />
      <SystemStatusBar status="degraded" message="Elevated database latency" lastChecked="30s ago" />
      <SystemStatusBar status="maintenance" message="Planned backup snapshot in progress" lastChecked="5 min ago" />
      <SystemStatusBar status="outage" message="Payment service unavailable" lastChecked="Just now" incidentUrl="https://status.unierp.com" />
    </div>
  ),
};
