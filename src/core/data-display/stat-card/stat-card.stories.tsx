import type { Meta, StoryObj } from "@storybook/react";
import { KPIStrip } from "./stat-card";
import { DollarSign, AlertTriangle, ShieldCheck, Activity } from "lucide-react";

const meta: Meta<typeof KPIStrip> = {
  title: "Core/DataDisplay/KPIStrip",
  component: KPIStrip,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof KPIStrip>;

export const ExecutiveStrip: Story = {
  args: {
    items: [
      {
        id: "rev",
        label: "Total Net Revenue",
        value: "$2,480,910.00",
        delta: "+14.2%",
        trend: "up",
        trendLabel: "vs prior period",
        icon: <DollarSign size={14} />,
      },
      {
        id: "cash",
        label: "Operating Cash Flow",
        value: "$682,100.00",
        delta: "-3.1%",
        trend: "down",
        trendLabel: "vs forecast",
        icon: <Activity size={14} />,
      },
      {
        id: "compliance",
        label: "SOX Audit Compliance",
        value: "99.8%",
        delta: "0.0%",
        trend: "neutral",
        trendLabel: "38 controls tested",
        icon: <ShieldCheck size={14} />,
      },
      {
        id: "unposted",
        label: "Draft Vouchers Pending",
        value: "14",
        delta: "+4",
        trend: "down",
        trendLabel: "Action required",
        icon: <AlertTriangle size={14} />,
      },
    ],
  },
};

export const AnatomyAndComposition: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
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
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      <div>
        <h4 style={{ marginBottom: "8px" }}>Positive Trend</h4>
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
        <h4 style={{ marginBottom: "8px" }}>Negative Trend</h4>
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
    </div>
  ),
};

