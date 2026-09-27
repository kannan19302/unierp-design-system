import type { Meta, StoryObj } from "@storybook/react";
import { TreeView } from "./tree-view";

const meta: Meta<typeof TreeView> = {
  title: "Compositions/TreeView",
  component: TreeView,
  tags: ["autodocs"],
  argTypes: {
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
      description: "Strata DL 4-tier density scaling",
    },
    selectedId: {
      control: "text",
      description: "ID of currently selected node",
    },
    nodes: {
      control: "object",
      description: "Hierarchical tree nodes data array",
    },
  },
};

export default meta;
type Story = StoryObj<typeof TreeView>;

export const ChartOfAccounts: Story = {
  args: {
    selectedId: "1010",
    nodes: [
      {
        id: "1000",
        label: "1000 - Assets",
        children: [
          {
            id: "1010",
            label: "1010 - Current Assets",
            children: [
              { id: "1011", label: "1011 - Cash and Equivalents" },
              { id: "1012", label: "1012 - Accounts Receivable" },
            ],
          },
          {
            id: "1020",
            label: "1020 - Fixed Assets",
            children: [{ id: "1021", label: "1021 - Computer Equipment" }],
          },
        ],
      },
      {
        id: "2000",
        label: "2000 - Liabilities",
        children: [{ id: "2010", label: "2010 - Accounts Payable" }],
      },
    ],
  },
};

export const AnatomyAndComposition: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxInlineSize: 400 }}>
      <h4>Component Anatomy &amp; Composition</h4>
      <TreeView {...args} />
    </div>
  ),
  args: {
    ...ChartOfAccounts.args,
  },
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", maxInlineSize: 500 }}>
      <div>
        <h4>Standard Hierarchical Tree</h4>
        <TreeView
          nodes={[
            {
              id: "root-1",
              label: "Organization Core",
              children: [
                { id: "sub-1", label: "Engineering Operations" },
                { id: "sub-2", label: "Financial Reporting" },
              ],
            },
          ]}
        />
      </div>
      <div>
        <h4>Flat Single-Level Selection</h4>
        <TreeView
          selectedId="leaf-1"
          nodes={[
            { id: "leaf-1", label: "Selected Active Document" },
            { id: "leaf-2", label: "Secondary Document" },
          ]}
        />
      </div>
    </div>
  ),
};

export const DensityGallery: Story = {
  render: () => {
    const sampleNodes = [
      {
        id: "1000",
        label: "1000 - Assets",
        children: [
          { id: "1010", label: "1010 - Cash & Equivalents", badge: "Live" },
          { id: "1020", label: "1020 - Accounts Receivable" },
        ],
      },
      { id: "2000", label: "2000 - Liabilities", badge: "Audited" },
    ];
    const densities = ["ultra-compact", "compact", "standard", "comfortable"] as const;

    return (
      <div style={{ display: "grid", gap: "var(--space-6)", maxInlineSize: "600px" }}>
        {densities.map((d) => (
          <div key={d} style={{ display: "grid", gap: "var(--space-2)" }}>
            <div style={{ fontWeight: 600, fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Density: {d}
            </div>
            <TreeView density={d} nodes={sampleNodes} selectedId="1010" />
          </div>
        ))}
      </div>
    );
  },
};

