import type { Meta, StoryObj } from "@storybook/react";
import { BladeNavigationStack } from "./blade-navigation-stack";

const meta: Meta<typeof BladeNavigationStack> = {
  title: "Navigation/BladeNavigationStack",
  component: BladeNavigationStack,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    a11y: {
      test: "todo",
    },
  },
};

export default meta;
type Story = StoryObj<typeof BladeNavigationStack>;

export const Default: Story = {
  args: {
    density: "compact",
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ inlineSize: "100%", blockSize: "400px" }}>
      <BladeNavigationStack density="standard" />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Compact Cascading Drill-down
        </h4>
        <div style={{ blockSize: "360px" }}>
          <BladeNavigationStack density="compact" />
        </div>
      </div>

      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Ultra-Compact Mode
        </h4>
        <div style={{ blockSize: "320px" }}>
          <BladeNavigationStack density="ultra-compact" />
        </div>
      </div>
    </div>
  ),
};
