import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { OmniJumpNavigator } from "./omni-jump-navigator";

const meta: Meta<typeof OmniJumpNavigator> = {
  title: "Navigation/OmniJumpNavigator",
  component: OmniJumpNavigator,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof OmniJumpNavigator>;

const sampleItems = [
  { id: "1", title: "Elena Rostova", subtitle: "Lead Finance Controller", prefix: "@" as const, category: "People", icon: <span>👤</span> },
  { id: "2", title: "Marcus Vance", subtitle: "VP Global Sales", prefix: "@" as const, category: "People", icon: <span>👤</span> },
  { id: "3", title: "Fiscal Year 2026 Close", subtitle: "Finance & Accounting Space", prefix: "#" as const, category: "Workspaces", icon: <span>📁</span> },
  { id: "4", title: "Project Apex Supply Chain", subtitle: "Procurement & Logistics", prefix: "#" as const, category: "Workspaces", icon: <span>📁</span> },
  { id: "5", title: "INV-2026-8891", subtitle: "Acme Industrial Corp • $142,500.00", prefix: "!" as const, category: "Records", icon: <span>📄</span> },
  { id: "6", title: "PO-7734", subtitle: "Atlas Steelworks • Pending Approval", prefix: "!" as const, category: "Records", icon: <span>🛒</span> },
  { id: "7", title: "Quarterly Revenue Waterfall", subtitle: "Financial Analytics Dashboard", prefix: ">" as const, category: "Views", icon: <span>📊</span> },
  { id: "8", title: "Aging AP Subledger Matrix", subtitle: "Accounts Payable Report", prefix: ">" as const, category: "Views", icon: <span>📈</span> },
];

export const Default: Story = {
  args: {
    items: sampleItems,
    isOpen: true,
    density: "standard",
    onSelect: (item) => alert(`Jumped to: ${item.title}`),
  },
};

export const Compact: Story = {
  args: {
    items: sampleItems,
    isOpen: true,
    density: "compact",
  },
};
