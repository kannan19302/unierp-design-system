import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TenantHierarchyScopeSelector } from "./tenant-hierarchy-scope-selector";

const meta: Meta<typeof TenantHierarchyScopeSelector> = {
  title: "Platforms/TenantAdmin/TenantHierarchyScopeSelector",
  component: TenantHierarchyScopeSelector,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    a11y: { test: "todo" },
  },
};

export default meta;
type Story = StoryObj<typeof TenantHierarchyScopeSelector>;

export const Default: Story = {
  args: {
    isOpenByDefault: false,
    density: "compact",
  },
};

export const OpenByDefault: Story = {
  args: {
    isOpenByDefault: true,
    density: "compact",
  },
};

export const UltraCompact: Story = {
  args: {
    isOpenByDefault: false,
    density: "ultra-compact",
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <p style={{ marginBlockEnd: "var(--space-2)", fontWeight: "bold" }}>Standard Corporate Scope Selector</p>
        <TenantHierarchyScopeSelector isOpenByDefault={false} density="standard" />
      </div>
      <div>
        <p style={{ marginBlockEnd: "var(--space-2)", fontWeight: "bold" }}>Compact Selector</p>
        <TenantHierarchyScopeSelector isOpenByDefault={false} density="compact" />
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <TenantHierarchyScopeSelector isOpenByDefault={false} density="ultra-compact" />
      <TenantHierarchyScopeSelector isOpenByDefault={false} density="compact" />
      <TenantHierarchyScopeSelector isOpenByDefault={false} density="standard" />
      <TenantHierarchyScopeSelector isOpenByDefault={false} density="comfortable" />
    </div>
  ),
};
