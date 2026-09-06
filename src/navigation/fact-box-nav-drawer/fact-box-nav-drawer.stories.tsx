import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FactBoxNavDrawer } from "./fact-box-nav-drawer";

const meta: Meta<typeof FactBoxNavDrawer> = {
  title: "Navigation/FactBoxNavDrawer",
  component: FactBoxNavDrawer,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof FactBoxNavDrawer>;

const sampleCards = [
  {
    id: "cust-stats",
    title: "Customer Statistics",
    badge: "Tier 1",
    metrics: [
      { label: "Credit Limit", value: "$250,000" },
      { label: "Balance Due", value: "$42,850" },
      { label: "Past Due 30+", value: "$0" },
    ],
    drilldownLabel: "View Ledger",
    onDrilldown: () => alert("Drilldown to Ledger"),
  },
  {
    id: "open-orders",
    title: "Open Sales Orders",
    badge: 3,
    metrics: [
      { label: "SO-8841", value: "$12,400" },
      { label: "SO-8890", value: "$8,500" },
    ],
    drilldownLabel: "View All Orders",
    onDrilldown: () => alert("Drilldown to Orders"),
  },
];

export const Default: Story = {
  args: {
    cards: sampleCards,
    isCollapsed: false,
    density: "standard",
    onToggleCollapse: () => alert("Toggle collapse"),
  },
};

export const Collapsed: Story = {
  args: {
    cards: sampleCards,
    isCollapsed: true,
  },
};
