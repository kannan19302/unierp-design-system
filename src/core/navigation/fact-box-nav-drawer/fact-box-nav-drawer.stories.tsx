import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FactBoxNavDrawer } from "./fact-box-nav-drawer";

const meta: Meta<typeof FactBoxNavDrawer> = {
  title: "Core/Navigation/FactBoxNavDrawer",
  component: FactBoxNavDrawer,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    a11y: { test: "todo" },
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
    onDrilldown: () => console.log("Drilldown to Ledger"),
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
    onDrilldown: () => console.log("Drilldown to Orders"),
  },
];

export const Default: Story = {
  args: {
    cards: sampleCards,
    isCollapsed: false,
    density: "standard",
    onToggleCollapse: () => console.log("Toggle collapse"),
  },
};

export const Collapsed: Story = {
  args: {
    cards: sampleCards,
    isCollapsed: true,
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "var(--space-6)" }}>
      <div>
        <p style={{ marginBlockEnd: "var(--space-2)", fontWeight: "bold" }}>Expanded FactBox</p>
        <FactBoxNavDrawer cards={sampleCards} isCollapsed={false} onToggleCollapse={() => {}} />
      </div>
      <div>
        <p style={{ marginBlockEnd: "var(--space-2)", fontWeight: "bold" }}>Collapsed FactBox</p>
        <FactBoxNavDrawer cards={sampleCards} isCollapsed={true} onToggleCollapse={() => {}} />
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-4)" }}>
      <FactBoxNavDrawer cards={sampleCards} density="ultra-compact" />
      <FactBoxNavDrawer cards={sampleCards} density="compact" />
      <FactBoxNavDrawer cards={sampleCards} density="standard" />
      <FactBoxNavDrawer cards={sampleCards} density="comfortable" />
    </div>
  ),
};
