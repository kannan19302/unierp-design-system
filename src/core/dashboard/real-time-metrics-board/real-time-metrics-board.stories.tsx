import type { Meta, StoryObj } from "@storybook/react";
import { RealTimeMetricsBoard } from "./real-time-metrics-board";

const SAMPLE_WIDGETS = [
  { id: "1", label: "CPU Usage", value: "67%", status: "normal" as const },
  { id: "2", label: "Memory", value: "82%", status: "warning" as const },
  { id: "3", label: "Requests/s", value: "1,247", unit: "req/s" },
  { id: "4", label: "Error Rate", value: "0.12%", status: "normal" as const },
  { id: "5", label: "P99 Latency", value: "245", unit: "ms", status: "warning" as const },
  { id: "6", label: "Active Users", value: "3,891" },
];

const CRITICAL_WIDGETS = [
  { id: "1", label: "API Gateway", value: "504 Gateway Timeout", status: "critical" as const },
  { id: "2", label: "DB Connection Pool", value: "99.8%", status: "critical" as const },
  { id: "3", label: "Kafka Lag", value: "1.2M msgs", status: "warning" as const },
  { id: "4", label: "Disk I/O", value: "480 MB/s", status: "normal" as const },
];

const meta: Meta<typeof RealTimeMetricsBoard> = {
  title: "Dashboard/RealTimeMetricsBoard",
  component: RealTimeMetricsBoard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    a11y: { test: "todo" },
  },
};

export default meta;
type Story = StoryObj<typeof RealTimeMetricsBoard>;

export const Default: Story = {
  render: () => (
    <div style={{ inlineSize: "600px", padding: "var(--space-4)" }}>
      <RealTimeMetricsBoard widgets={SAMPLE_WIDGETS} />
    </div>
  ),
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ inlineSize: "640px", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <RealTimeMetricsBoard
        title="Infrastructure Health Telemetry"
        widgets={SAMPLE_WIDGETS}
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ inlineSize: "640px", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h3 style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Nominal Operational Telemetry
        </h3>
        <RealTimeMetricsBoard
          title="Cluster Health — US-East"
          widgets={SAMPLE_WIDGETS}
        />
      </div>

      <div>
        <h3 style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Degraded / Incident Alert State
        </h3>
        <RealTimeMetricsBoard
          title="Incident Monitor — Outage Detected"
          widgets={CRITICAL_WIDGETS}
        />
      </div>
    </div>
  ),
};
