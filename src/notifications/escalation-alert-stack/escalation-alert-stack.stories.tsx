import type { Meta, StoryObj } from "@storybook/react";
import { EscalationAlertStack } from "./escalation-alert-stack";

const SAMPLE_ALERTS = [
  {
    id: "1",
    title: "Database CPU at 98%",
    severity: "critical" as const,
    timestamp: "30s ago",
    source: "prod-db-01",
  },
  {
    id: "2",
    title: "API Error Rate > 5%",
    severity: "high" as const,
    timestamp: "2 min ago",
    source: "api-gateway",
  },
  {
    id: "3",
    title: "High queue latency",
    severity: "medium" as const,
    timestamp: "5 min ago",
    source: "kafka-consumer-04",
  },
];

const meta: Meta<typeof EscalationAlertStack> = {
  title: "Notifications/EscalationAlertStack",
  component: EscalationAlertStack,
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
type Story = StoryObj<typeof EscalationAlertStack>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 600, padding: "var(--space-4)" }}>
      <EscalationAlertStack alerts={SAMPLE_ALERTS} onAcknowledge={() => {}} onSnooze={() => {}} />
    </div>
  ),
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ width: 600, display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <EscalationAlertStack
        alerts={[
          {
            id: "crit-1",
            title: "Replication Lag > 15s (Replica 2)",
            severity: "critical",
            timestamp: "Just now",
            source: "us-east-cluster",
          },
        ]}
        onAcknowledge={() => {}}
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ width: 600, display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <EscalationAlertStack alerts={SAMPLE_ALERTS} onAcknowledge={() => {}} onSnooze={() => {}} />
    </div>
  ),
};
