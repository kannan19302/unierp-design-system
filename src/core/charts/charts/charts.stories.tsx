import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  Charts,
  KPICard,
  MiniBarChart,
  MiniDonutChart,
  Sparkline,
  GaugeChart,
  FunnelChart,
} from "./charts";
import { TrendingUp, Users, DollarSign } from "lucide-react";

const meta: Meta<typeof Charts> = {
  title: "Core/Charts/ChartsSuite",
  component: Charts,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    a11y: {
      test: "todo",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Charts>;

export const Default: Story = {
  render: () => (
    <Charts style={{ display: "flex", gap: "var(--space-4)" }}>
      <KPICard
        title="Revenue"
        value="$124,560"
        change={12.3}
        changeLabel="vs last month"
        icon={<DollarSign size={20} />}
      />
      <KPICard
        title="Users"
        value="2,450"
        change={8.1}
        changeLabel="vs last month"
        icon={<Users size={20} />}
      />
      <KPICard
        title="Growth"
        value="18.5%"
        change={-2.3}
        changeLabel="vs last month"
        icon={<TrendingUp size={20} />}
      />
    </Charts>
  ),
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <Charts style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div style={{ display: "flex", gap: "var(--space-4)" }}>
        <KPICard
          title="Daily Active Users"
          value="48,290"
          change={5.4}
          changeLabel="vs yesterday"
        />
        <MiniBarChart
          data={[
            { label: "Jan", value: 400 },
            { label: "Feb", value: 300 },
            { label: "Mar", value: 500 },
            { label: "Apr", value: 450 },
          ]}
          height={80}
        />
      </div>
      <div style={{ display: "flex", gap: "var(--space-4)", alignItems: "center" }}>
        <MiniDonutChart
          segments={[
            { label: "Completed", value: 70, color: "var(--color-success)" },
            { label: "Pending", value: 30, color: "var(--color-warning)" },
          ]}
          size={100}
        />
        <Sparkline data={[10, 25, 15, 30, 20, 35, 28, 40]} height={40} width={180} />
      </div>
    </Charts>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <Charts style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div style={{ display: "flex", gap: "var(--space-4)" }}>
        <KPICard title="Direct Conversion" value="3.42%" change={0.8} />
        <KPICard title="Organic Search" value="12,890" change={-1.2} />
      </div>
      <div style={{ display: "flex", gap: "var(--space-6)" }}>
        <GaugeChart value={78} />
        <FunnelChart
          stages={[
            { label: "Impressions", value: 5000 },
            { label: "Clicks", value: 1200 },
            { label: "Conversions", value: 320 },
          ]}
        />
      </div>
    </Charts>
  ),
};
