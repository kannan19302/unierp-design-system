import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { LiveRegion, type LiveRegionProps } from "./live-region";
import { Button } from "../button";

const meta: Meta<typeof LiveRegion> = {
  title: "Primitives/LiveRegion",
  component: LiveRegion,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof LiveRegion>;

function InteractiveLiveRegionDemo(props: Partial<LiveRegionProps>) {
  const [count, setCount] = useState(1);
  const [message, setMessage] = useState("Batch #4820 initiated in background.");

  const handleUpdate = () => {
    const next = count + 1;
    setCount(next);
    setMessage(`Reconciled batch #${4820 + next}: ${next * 14} journal vouchers posted.`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", width: 440 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>
          Simulate background worker dispatch
        </span>
        <Button variant="primary" size="sm" onClick={handleUpdate}>
          Dispatch Announcement
        </Button>
      </div>

      <LiveRegion variant="banner" politeness="polite" {...props}>
        {message}
      </LiveRegion>
    </div>
  );
}

export const PoliteBanner: Story = {
  render: () => <InteractiveLiveRegionDemo politeness="polite" />,
};

export const AssertiveAlert: Story = {
  render: () => (
    <InteractiveLiveRegionDemo
      politeness="assertive"
      children="Critical: Fiscal period Q3 reconciliation threshold exceeded!"
    />
  ),
};

export const BadgeCapsule: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <LiveRegion variant="badge" politeness="polite">
        Connected to Kafka stream (cluster us-east-1)
      </LiveRegion>
      <LiveRegion variant="badge" politeness="assertive">
        Failover active: Read-only replica mode
      </LiveRegion>
    </div>
  ),
};

export const TelemetryHUD: Story = {
  render: () => (
    <LiveRegion variant="hud" politeness="polite">
      <span>SYNC_STATUS: ACTIVE</span>
      <span>|</span>
      <span>LATENCY: 12ms</span>
      <span>|</span>
      <span>OUTBOX_QUEUE: 0 PENDING</span>
    </LiveRegion>
  ),
};

