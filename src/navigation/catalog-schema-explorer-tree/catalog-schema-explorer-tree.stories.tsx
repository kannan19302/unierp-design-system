import type { Meta, StoryObj } from "@storybook/react";
import { CatalogSchemaExplorerTree } from "./catalog-schema-explorer-tree";

const meta: Meta<typeof CatalogSchemaExplorerTree> = {
  title: "Navigation/CatalogSchemaExplorerTree",
  component: CatalogSchemaExplorerTree,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CatalogSchemaExplorerTree>;

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

export const Comfortable: Story = {
  args: {
    density: "comfortable",
  },
};
