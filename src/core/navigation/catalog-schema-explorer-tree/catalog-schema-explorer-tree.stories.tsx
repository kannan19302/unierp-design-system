import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { CatalogSchemaExplorerTree } from "./catalog-schema-explorer-tree";

const meta: Meta<typeof CatalogSchemaExplorerTree> = {
  title: "Navigation/CatalogSchemaExplorerTree",
  component: CatalogSchemaExplorerTree,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    a11y: { test: "todo" },
  },
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

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "var(--space-6)", alignItems: "flex-start" }}>
      <div>
        <p style={{ marginBlockEnd: "var(--space-2)", fontWeight: "bold" }}>Production Warehouse Schema</p>
        <CatalogSchemaExplorerTree
          catalogName="Production Snowflake Warehouse"
          density="compact"
          initialSelectedId="tbl_gl_entries"
        />
      </div>
      <div>
        <p style={{ marginBlockEnd: "var(--space-2)", fontWeight: "bold" }}>Analytics Data Lake</p>
        <CatalogSchemaExplorerTree
          catalogName="AWS Glue Data Catalog"
          density="standard"
          initialSelectedId="view_kpi_arr"
        />
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-4)" }}>
      <CatalogSchemaExplorerTree density="ultra-compact" />
      <CatalogSchemaExplorerTree density="compact" />
      <CatalogSchemaExplorerTree density="standard" />
      <CatalogSchemaExplorerTree density="comfortable" />
    </div>
  ),
};
