import type { Meta, StoryObj } from "@storybook/react";
import { DashboardGridLayout } from "./dashboard-grid-layout";

const meta: Meta<typeof DashboardGridLayout> = {
  title: "Core/Dashboard/DashboardGridLayout",
  component: DashboardGridLayout,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    a11y: { test: "todo" },
  },
};

export default meta;
type Story = StoryObj<typeof DashboardGridLayout>;

export const Default: Story = {
  render: () => (
    <div style={{ inlineSize: 720, paddingBlock: "var(--space-4)", paddingInline: "var(--space-4)" }}>
      <DashboardGridLayout columns={3}>
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
        <h4 style={{ marginBlockEnd: "var(--space-2)", color: "var(--color-text-secondary)" }}>
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
        <h4 style={{ marginBlockEnd: "var(--space-2)", color: "var(--color-text-secondary)" }}>
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
