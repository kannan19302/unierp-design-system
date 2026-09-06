import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { RecentItemsHistoryMenu } from "./recent-items-history-menu";

const meta: Meta<typeof RecentItemsHistoryMenu> = {
  title: "Navigation/RecentItemsHistoryMenu",
  component: RecentItemsHistoryMenu,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof RecentItemsHistoryMenu>;

const sampleItems = [
  {
    id: "inv-001",
    title: "INV-2026-0089",
    subtitle: "Acme Industrial Corp • $42,500.00",
    module: "Finance",
    icon: <span>📄</span>,
    pinned: true,
  },
  {
    id: "so-102",
    title: "SO-9921",
    subtitle: "Global Freight Systems",
    module: "Sales",
    icon: <span>📦</span>,
    pinned: false,
  },
  {
    id: "po-441",
    title: "PO-7712",
    subtitle: "Atlas Steelworks Supplies",
    module: "Procurement",
    icon: <span>🛒</span>,
    pinned: false,
  },
  {
    id: "rep-009",
    title: "Quarterly Revenue Forecast Q3",
    subtitle: "Saved Analytics Report",
    module: "Analytics",
    icon: <span>📊</span>,
    pinned: true,
  },
];

export const Default: Story = {
  args: {
    items: sampleItems,
    title: "Recent Items",
    density: "standard",
    onItemClick: (item) => alert(`Selected: ${item.title}`),
    onTogglePin: (id, pinned) => alert(`Toggle pin: ${id} -> ${pinned}`),
    onClearHistory: () => alert("Clear history clicked"),
  },
};

export const Compact: Story = {
  args: {
    items: sampleItems,
    title: "Recent History",
    density: "compact",
  },
};
