import type { Meta, StoryObj } from "@storybook/react";
import { OperationalDashboard } from "./operational-dashboard";

const meta: Meta<typeof OperationalDashboard> = {
  title: "Dashboard/OperationalDashboard",
  component: OperationalDashboard,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof OperationalDashboard>;

export const Default: Story = {
  args: {
    title: "Distribution Center #4 — Operations",
    subtitle: "Real-time dispatch, inventory movements, and sorting queue",
    kpis: [
      { label: "Daily Dispatch Target", value: "8,400 units", change: 4.5 },
      { label: "Dock Utilization", value: "92%", change: 1.1 },
      { label: "Average Turnaround", value: "18 mins", change: -12.4 },
      { label: "Open Exceptions", value: "3 orders", change: -50 },
    ],
    mainChart: (
      <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-sm)" }}>
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
