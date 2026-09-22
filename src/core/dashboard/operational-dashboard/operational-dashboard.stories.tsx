import type { Meta, StoryObj } from "@storybook/react";
import { OperationalDashboard } from "./operational-dashboard";

const sampleKpis = [
  { label: "Daily Dispatch Target", value: "8,400 units", change: 4.5 },
  { label: "Dock Utilization", value: "92%", change: 1.1 },
  { label: "Average Turnaround", value: "18 mins", change: -12.4 },
  { label: "Open Exceptions", value: "3 orders", change: -50 },
];

const meta: Meta<typeof OperationalDashboard> = {
  title: "Dashboard/OperationalDashboard",
  component: OperationalDashboard,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    a11y: { test: "todo" },
  },
};

export default meta;
type Story = StoryObj<typeof OperationalDashboard>;

export const Default: Story = {
  args: {
    title: "Distribution Center #4 — Operations",
    subtitle: "Real-time dispatch, inventory movements, and sorting queue",
    kpis: sampleKpis,
    mainChart: (
      <div style={{ blockSize: 180, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-surface-sunken)", borderRadius: "var(--radius-sm)" }}>
        Hourly Throughput Heatmap Visual
      </div>
    ),
    activityTable: (
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0" }}>Recent Gate Check-ins</h4>
        <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Trailer #4092 checked into Bay 4 • 2 mins ago
        </div>
      </div>
    ),
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ padding: "var(--space-4)" }}>
      <OperationalDashboard
        title="Manufacturing Line 2"
        subtitle="OEE & Yield Monitor"
        kpis={[
          { label: "Overall Equipment Efficiency", value: "88.4%", change: 2.1 },
          { label: "Scrap Rate", value: "0.4%", change: -0.2 },
        ]}
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ padding: "var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", color: "var(--color-text-secondary)" }}>
          Full Operational Canvas with Secondary Chart
        </h4>
        <OperationalDashboard
          title="Consolidated Logistics Hub"
          subtitle="Regional freight pacing"
          kpis={sampleKpis}
          mainChart={
            <div style={{ blockSize: 140, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-surface-sunken)", borderRadius: "var(--radius-sm)" }}>
              Fleet Velocity Chart
            </div>
          }
          secondaryChart={
            <div style={{ blockSize: 140, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-surface-sunken)", borderRadius: "var(--radius-sm)" }}>
              Fuel Efficiency Breakdown
            </div>
          }
        />
      </div>
    </div>
  ),
};
