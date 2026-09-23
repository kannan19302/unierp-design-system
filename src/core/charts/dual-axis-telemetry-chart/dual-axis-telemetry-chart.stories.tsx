import type { Meta, StoryObj } from "@storybook/react";
import {
  DualAxisTelemetryChart,
  type TelemetryDataPoint,
} from "./dual-axis-telemetry-chart";

const meta: Meta<typeof DualAxisTelemetryChart> = {
  title: "Core/Charts/DualAxisTelemetryChart",
  component: DualAxisTelemetryChart,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    a11y: {
      test: "todo",
    },
  },
};

export default meta;
type Story = StoryObj<typeof DualAxisTelemetryChart>;

const SAMPLE_TELEMETRY: TelemetryDataPoint[] = [
  { time: "10:00", successRate: 99.98, latencyMs: 24 },
  { time: "10:15", successRate: 99.99, latencyMs: 22 },
  { time: "10:30", successRate: 99.95, latencyMs: 38 },
  { time: "10:45", successRate: 99.92, latencyMs: 45 },
  { time: "11:00", successRate: 99.88, latencyMs: 62 },
  { time: "11:15", successRate: 99.95, latencyMs: 34 },
  { time: "11:30", successRate: 99.99, latencyMs: 21 },
  { time: "11:45", successRate: 100.0, latencyMs: 19 },
];

export const Default: Story = {
  args: {
    data: SAMPLE_TELEMETRY,
    title: "Gateway Telemetry: Success Rate vs P95 Latency",
  },
};

export const HighTrafficSpike: Story = {
  args: {
    data: [
      { time: "14:00", successRate: 99.99, latencyMs: 18 },
      { time: "14:10", successRate: 99.95, latencyMs: 25 },
      { time: "14:20", successRate: 98.42, latencyMs: 145 },
      { time: "14:30", successRate: 98.15, latencyMs: 180 },
      { time: "14:40", successRate: 99.65, latencyMs: 75 },
      { time: "14:50", successRate: 99.98, latencyMs: 24 },
    ],
    title: "Black Friday Load Surge Telemetry",
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <div style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-muted)" }}>
        <strong>DualAxisTelemetryChart Anatomy:</strong>
        <ol style={{ margin: "var(--space-2) 0", paddingInlineStart: "var(--space-4)" }}>
          <li>Dual Y-Axes (Left: Success Rate %, Right: P95 Latency in milliseconds)</li>
          <li>Latency Columns (Visual volume bars anchored at bottom zero baseline)</li>
          <li>Success Rate Continuous Line & Data Nodes (Green trendline across time intervals)</li>
          <li>Hover Tooltip (Correlated readout with exact timestamp and synchronized values)</li>
          <li>Screen Reader Data Table Fallback for WCAG 2.2 AA non-text content compliance</li>
        </ol>
      </div>
      <DualAxisTelemetryChart data={SAMPLE_TELEMETRY} />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)" }}>Normal Operating Baseline</h4>
        <DualAxisTelemetryChart data={SAMPLE_TELEMETRY} />
      </div>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)" }}>High Latency Spike Event</h4>
        <DualAxisTelemetryChart
          data={[
            { time: "01:00", successRate: 99.99, latencyMs: 20 },
            { time: "02:00", successRate: 98.2, latencyMs: 160 },
            { time: "03:00", successRate: 99.95, latencyMs: 25 },
          ]}
        />
      </div>
    </div>
  ),
};
