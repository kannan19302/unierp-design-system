import type { Meta, StoryObj } from "@storybook/react";
import { KPIStrip, StatCard } from "./stat-card";
import { DollarSign, AlertTriangle, ShieldCheck, Activity } from "lucide-react";

const meta: Meta<typeof KPIStrip> = {
  title: "Compositions/StatCard",
  component: KPIStrip,
  tags: ["autodocs"],
  argTypes: {
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
      description: "Strata 4-tier density scaling.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof KPIStrip>;

const sampleItems = [
  {
    id: "rev",
    label: "Total Net Revenue",
    value: "$2,480,910.00",
    delta: "+14.2%",
    trend: "up" as const,
    trendLabel: "vs prior period",
    icon: <DollarSign size={14} />,
  },
  {
    id: "cash",
    label: "Operating Cash Flow",
    value: "$682,100.00",
    delta: "-3.1%",
    trend: "down" as const,
    trendLabel: "vs forecast",
    icon: <Activity size={14} />,
  },
  {
    id: "compliance",
    label: "SOX Audit Compliance",
    value: "99.8%",
    delta: "0.0%",
    trend: "neutral" as const,
    trendLabel: "38 controls tested",
    icon: <ShieldCheck size={14} />,
  },
  {
    id: "unposted",
    label: "Draft Vouchers Pending",
    value: "14",
    delta: "+4",
    trend: "down" as const,
    trendLabel: "Action required",
    icon: <AlertTriangle size={14} />,
  },
];

export const ExecutiveStrip: Story = {
  args: {
    density: "standard",
    items: sampleItems,
  },
};

export const DensityGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)" }}>Ultra-Compact (16px value)</h4>
        <KPIStrip density="ultra-compact" items={sampleItems.slice(0, 3)} />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)" }}>Compact (20px value)</h4>
        <KPIStrip density="compact" items={sampleItems.slice(0, 3)} />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)" }}>Standard (24px value)</h4>
        <KPIStrip density="standard" items={sampleItems.slice(0, 3)} />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)" }}>Comfortable (30px value)</h4>
        <KPIStrip density="comfortable" items={sampleItems.slice(0, 3)} />
      </div>
    </div>
  ),
};

export const AnatomyAndComposition: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <KPIStrip {...args} />
    </div>
  ),
  args: {
    items: [
      {
        id: "kpi-1",
        label: "Sample Metric",
        value: "98.5%",
        delta: "+1.2%",
        trend: "up",
      },
    ],
  },
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)" }}>Positive Trend</h4>
        <KPIStrip
          items={[
            {
              id: "rev",
              label: "Revenue Growth",
              value: "$1.2M",
              delta: "+18%",
              trend: "up",
            },
          ]}
        />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)" }}>Negative Trend</h4>
        <KPIStrip
          items={[
            {
              id: "churn",
              label: "Net Churn",
              value: "4.2%",
              delta: "-0.8%",
              trend: "down",
            },
          ]}
        />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)" }}>Single Standalone StatCard</h4>
        <div style={{ inlineSize: 240 }}>
          <StatCard
            id="single-kpi"
            label="Daily Active Users"
            value="14,290"
            delta="+2.4%"
            trend="up"
          />
        </div>
      </div>
    </div>
  ),
};
