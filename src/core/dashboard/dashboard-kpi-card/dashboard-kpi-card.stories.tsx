import type { Meta, StoryObj } from "@storybook/react";
import { Users, DollarSign, Activity } from "lucide-react";
import { DashboardKPICard } from "./dashboard-kpi-card";

const meta: Meta<typeof DashboardKPICard> = {
  title: "Core/Dashboard/DashboardKpiCard",
  component: DashboardKPICard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    a11y: { test: "todo" },
  },
};

export default meta;
type Story = StoryObj<typeof DashboardKPICard>;

export const Revenue: Story = {
  args: {
    title: "Gross Revenue",
    value: "$142,800",
    change: 14.2,
    changeLabel: "vs prior quarter",
    icon: <DollarSign size={20} />,
    color: "var(--color-brand)",
    trend: [100, 110, 105, 125, 138, 142],
  },
};

export const GoalProgress: Story = {
  args: {
    title: "Annual Active Users",
    value: "18,450",
    change: 6.8,
    progress: 74,
    progressLabel: "Target: 25,000",
    icon: <Users size={20} />,
    color: "var(--color-success)",
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ inlineSize: 320, display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <DashboardKPICard
        title="Payment Success Rate"
        value="99.98%"
        change={0.04}
        changeLabel="vs target SLA"
        icon={<Activity size={20} />}
        color="var(--color-brand)"
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ inlineSize: 680, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
      <DashboardKPICard
        title="Gross Revenue"
        value="$142,800"
        change={14.2}
        changeLabel="vs last quarter"
        icon={<DollarSign size={20} />}
        color="var(--color-brand)"
        trend={[100, 110, 105, 125, 138, 142]}
      />
      <DashboardKPICard
        title="Annual Active Users"
        value="18,450"
        change={-2.4}
        changeLabel="vs forecast"
        progress={74}
        progressLabel="Target: 25,000"
        icon={<Users size={20} />}
        color="var(--color-success)"
      />
      <DashboardKPICard
        title="Processing Batch"
        value="Loading..."
        loading
      />
      <DashboardKPICard
        title="Active Incidents"
        value="0"
        change={0}
        changeLabel="Zero open Sev-1"
        icon={<Activity size={20} />}
        color="var(--color-success)"
      />
    </div>
  ),
};
