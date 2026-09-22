import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { RecentItemsHistoryMenu } from "./recent-items-history-menu";

const meta: Meta<typeof RecentItemsHistoryMenu> = {
  title: "Navigation/RecentItemsHistoryMenu",
  component: RecentItemsHistoryMenu,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    a11y: { test: "todo" },
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
    onItemClick: (item) => console.log(`Selected: ${item.title}`),
    onTogglePin: (id, pinned) => console.log(`Pin: ${id} -> ${pinned}`),
    onClearHistory: () => console.log("Clear history"),
  },
};

export const Compact: Story = {
  args: {
    items: sampleItems,
    title: "Recent History",
    density: "compact",
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "var(--space-6)" }}>
      <div>
        <p style={{ marginBlockEnd: "var(--space-2)", fontWeight: "bold" }}>Standard Recents Menu</p>
        <RecentItemsHistoryMenu
          items={sampleItems}
          onItemClick={() => {}}
          onTogglePin={() => {}}
          onClearHistory={() => {}}
        />
      </div>
      <div>
        <p style={{ marginBlockEnd: "var(--space-2)", fontWeight: "bold" }}>Compact Menu Without Clear</p>
        <RecentItemsHistoryMenu
          items={sampleItems.slice(0, 2)}
          density="compact"
          onItemClick={() => {}}
        />
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-4)" }}>
      <RecentItemsHistoryMenu items={sampleItems} density="ultra-compact" />
      <RecentItemsHistoryMenu items={sampleItems} density="compact" />
      <RecentItemsHistoryMenu items={sampleItems} density="standard" />
      <RecentItemsHistoryMenu items={sampleItems} density="comfortable" />
    </div>
  ),
};
