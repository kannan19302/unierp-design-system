import type { Meta, StoryObj } from "@storybook/react";
import { TrendingUp, Users, DollarSign, Activity } from "lucide-react";
import { DashboardKPICard } from "./dashboard-kpi-card";

const meta: Meta<typeof DashboardKPICard> = {
  title: "Dashboard/KPICard",
  component: DashboardKPICard,
  parameters: { layout: "centered" },
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
    color: "#2563eb",
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
    color: "#10b981",
  },
};
