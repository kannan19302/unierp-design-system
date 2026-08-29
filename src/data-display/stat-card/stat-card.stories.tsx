import type { Meta, StoryObj } from "@storybook/react";
import { KPIStrip } from "./stat-card";
import { DollarSign, AlertTriangle, ShieldCheck, Activity } from "lucide-react";

const meta: Meta<typeof KPIStrip> = {
  title: "DataDisplay/KPIStrip",
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
