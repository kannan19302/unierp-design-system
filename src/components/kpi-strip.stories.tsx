import type { Meta, StoryObj } from "@storybook/react";
import { KPIStrip } from "./kpi-strip";

const meta: Meta<typeof KPIStrip> = {
  title: "Components/KPIStrip",
  component: KPIStrip,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof KPIStrip>;

export const Default: Story = {
  args: {
    items: [
      {
        id: "mrr",
        label: "Monthly Recurring Revenue",
        value: "$142,500.00",
        change: "+12.4%",
        trend: "up",
        subtitle: "vs. prior month",
      },
      {
        id: "active-users",
        label: "Daily Active Accounts",
        value: "8,924",
        change: "+5.1%",
        trend: "up",
      },
      {
        id: "churn",
        label: "Net Revenue Churn",
        value: "0.82%",
        change: "-0.15%",
        trend: "down",
      },
      {
        id: "arpu",
        label: "Average Revenue / Tenant",
        value: "$2,450.00",
        trend: "neutral",
      },
    ],
  },
};
