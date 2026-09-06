import type { Meta, StoryObj } from "@storybook/react";
import { TenantHierarchyScopeSelector } from "./tenant-hierarchy-scope-selector";

const meta: Meta<typeof TenantHierarchyScopeSelector> = {
  title: "Navigation/TenantHierarchyScopeSelector",
  component: TenantHierarchyScopeSelector,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
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
    isOpenByDefault: true,
    density: "ultra-compact",
  },
};
