import type { Meta, StoryObj } from "@storybook/react";
import { DashboardGridLayout } from "./dashboard-page";

const meta: Meta<typeof DashboardGridLayout> = {
  title: "Templates/DashboardGridLayout",
  component: DashboardGridLayout,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
      description: "Strata 4-tier density scaling.",
    },
    columns: {
      control: { type: "number", min: 1, max: 6 },
      description: "Number of grid columns.",
    },
    gap: {
      control: "text",
      description: "Grid gap between tiles.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof DashboardGridLayout>;

export const Default: Story = {
  render: (args) => (
    <div style={{ inlineSize: 720, paddingBlock: "var(--space-4)", paddingInline: "var(--space-4)" }}>
      <DashboardGridLayout {...args}>
        <div style={{ blockSize: 120, background: "var(--color-surface-sunken)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-secondary)" }}>
          Widget A
        </div>
        <div style={{ blockSize: 120, background: "var(--color-surface-sunken)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-secondary)" }}>
          Widget B
        </div>
        <div style={{ blockSize: 120, background: "var(--color-surface-sunken)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-secondary)" }}>
          Widget C
        </div>
      </DashboardGridLayout>
    </div>
  ),
  args: {
    columns: 3,
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ inlineSize: 720, display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <DashboardGridLayout columns={2} gap={24}>
        <div style={{ blockSize: 140, background: "var(--color-surface-sunken)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          Double Column Left
        </div>
        <div style={{ blockSize: 140, background: "var(--color-surface-sunken)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          Double Column Right
        </div>
      </DashboardGridLayout>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ inlineSize: 720, display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", marginBlockStart: 0, marginInline: 0, color: "var(--color-text-secondary)" }}>
          4-Column Compact Grid
        </h4>
        <DashboardGridLayout columns={4} gap={12}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{ blockSize: 80, background: "var(--color-surface-sunken)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "var(--text-xs)" }}>
              Tile {i}
            </div>
          ))}
        </DashboardGridLayout>
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", marginBlockStart: 0, marginInline: 0, color: "var(--color-text-secondary)" }}>
          Single Column Dense Stack
        </h4>
        <DashboardGridLayout columns={1} gap={8}>
          <div style={{ blockSize: 60, background: "var(--color-surface-sunken)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "var(--text-xs)" }}>
            Full Width Banner Widget
          </div>
        </DashboardGridLayout>
      </div>
    </div>
  ),
};

export const DensityGallery: Story = {
  name: "Density scale comparison",
  render: () => (
    <div style={{ inlineSize: 720, display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      {(["ultra-compact", "compact", "standard", "comfortable"] as const).map((density) => (
        <div key={density} style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", padding: "var(--space-2)" }}>
          <div style={{ fontWeight: 600, fontSize: "var(--text-xs)", marginBlockEnd: "var(--space-2)" }}>
            Density: {density}
          </div>
          <DashboardGridLayout density={density} columns={3}>
            <div style={{ blockSize: 60, background: "var(--color-surface-sunken)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "var(--text-xs)" }}>
              Card 1
            </div>
            <div style={{ blockSize: 60, background: "var(--color-surface-sunken)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "var(--text-xs)" }}>
              Card 2
            </div>
            <div style={{ blockSize: 60, background: "var(--color-surface-sunken)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "var(--text-xs)" }}>
              Card 3
            </div>
          </DashboardGridLayout>
        </div>
      ))}
    </div>
  ),
};
