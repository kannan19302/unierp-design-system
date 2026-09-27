import type { Meta, StoryObj } from "@storybook/react";
import { SystemStatusBar } from "./status-bar";

const meta: Meta<typeof SystemStatusBar> = {
  title: "Navigation/SystemStatusBar",
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
  argTypes: {
    status: {
      control: "select",
      options: ["operational", "degraded", "outage", "maintenance"],
      description: "Platform health and incident state indicator.",
    },
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
      description: "Strata 4-tier density scaling.",
    },
    message: {
      control: "text",
      description: "Informational or incident summary message.",
    },
    lastChecked: {
      control: "text",
      description: "Human-readable timestamp of the last health check.",
    },
    incidentUrl: {
      control: "text",
      description: "Direct URL to incident report or public status page.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof SystemStatusBar>;

export const Default: Story = {
  args: {
    status: "operational",
    density: "standard",
    lastChecked: "30s ago",
  },
  render: (args) => (
    <div style={{ inlineSize: "100%", minInlineSize: "480px", maxInlineSize: "680px", padding: "var(--space-4)" }}>
      <SystemStatusBar {...args} />
    </div>
  ),
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ inlineSize: "100%", minInlineSize: "480px", maxInlineSize: "680px", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <SystemStatusBar
        status="degraded"
        density="standard"
        message="High response time in us-east-1 RDS cluster"
        lastChecked="Just now"
        incidentUrl="https://status.unierp.com/incidents/inc-4892"
      />
    </div>
  ),
};

export const DensityGallery: Story = {
  render: () => (
    <div style={{ inlineSize: "100%", minInlineSize: "480px", maxInlineSize: "680px", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
      <SystemStatusBar status="operational" density="ultra-compact" lastChecked="30s ago" message="Ultra-compact (24px)" />
      <SystemStatusBar status="operational" density="compact" lastChecked="30s ago" message="Compact (28px)" />
      <SystemStatusBar status="operational" density="standard" lastChecked="30s ago" message="Standard (32px)" />
      <SystemStatusBar status="operational" density="comfortable" lastChecked="30s ago" message="Comfortable (40px)" />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ inlineSize: "100%", minInlineSize: "480px", maxInlineSize: "680px", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
      <SystemStatusBar status="operational" lastChecked="1 min ago" />
      <SystemStatusBar status="degraded" message="Elevated database latency" lastChecked="30s ago" />
      <SystemStatusBar status="maintenance" message="Planned backup snapshot in progress" lastChecked="5 min ago" />
      <SystemStatusBar status="outage" message="Payment service unavailable" lastChecked="Just now" incidentUrl="https://status.unierp.com" />
    </div>
  ),
};
