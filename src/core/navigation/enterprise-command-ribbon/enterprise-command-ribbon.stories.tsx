import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { EnterpriseCommandRibbon } from "./enterprise-command-ribbon";

const meta: Meta<typeof EnterpriseCommandRibbon> = {
  title: "Core/Navigation/EnterpriseCommandRibbon",
  component: EnterpriseCommandRibbon,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    a11y: { test: "todo" },
  },
};

export default meta;
type Story = StoryObj<typeof EnterpriseCommandRibbon>;

export const Default: Story = {
  args: {
    density: "compact",
  },
};

export const UltraCompact: Story = {
  args: {
    density: "ultra-compact",
  },
};

export const NavigateTabActive: Story = {
  args: {
    density: "compact",
    initialTabId: "tab_navigate",
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <p style={{ marginBlockEnd: "var(--space-2)", fontWeight: "bold" }}>Standard Financial Ribbon</p>
        <EnterpriseCommandRibbon density="standard" />
      </div>
      <div>
        <p style={{ marginBlockEnd: "var(--space-2)", fontWeight: "bold" }}>Compact Dynamics Ribbon</p>
        <EnterpriseCommandRibbon density="compact" initialTabId="tab_reports" />
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <EnterpriseCommandRibbon density="ultra-compact" />
      <EnterpriseCommandRibbon density="compact" />
      <EnterpriseCommandRibbon density="standard" />
      <EnterpriseCommandRibbon density="comfortable" />
    </div>
  ),
};
