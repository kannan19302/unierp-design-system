import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SubTabBar } from "./sub-tab-bar";

const meta: Meta<typeof SubTabBar> = {
  title: "Core/Navigation/SubTabBar",
  component: SubTabBar,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    a11y: { test: "todo" },
  },
};

export default meta;
type Story = StoryObj<typeof SubTabBar>;

const sampleTabs = [
  { id: "overview", label: "Overview", href: "/overview" },
  { id: "lines", label: "Voucher Lines", href: "/lines" },
  { id: "tax", label: "Tax Breakdown", href: "/tax" },
  { id: "audit", label: "Audit Log", href: "/audit" },
];

export const Default: Story = {
  args: {
    tabs: sampleTabs,
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <p style={{ marginBlockEnd: "var(--space-2)", fontWeight: "bold" }}>Standard Voucher Sub-Tabs</p>
        <SubTabBar tabs={sampleTabs} />
      </div>
      <div>
        <p style={{ marginBlockEnd: "var(--space-2)", fontWeight: "bold" }}>Compact Sub-Tabs</p>
        <SubTabBar tabs={sampleTabs.slice(0, 2)} />
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <SubTabBar tabs={sampleTabs} />
      <SubTabBar tabs={sampleTabs.slice(0, 3)} />
      <SubTabBar tabs={sampleTabs.slice(1, 4)} />
    </div>
  ),
};
