import type { Meta, StoryObj } from "@storybook/react";
import { AppLauncherWaffleGrid } from "./app-launcher-waffle-grid";

const meta: Meta<typeof AppLauncherWaffleGrid> = {
  title: "Navigation/AppLauncherWaffleGrid",
  component: AppLauncherWaffleGrid,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    a11y: {
      test: "todo",
    },
  },
};

export default meta;
type Story = StoryObj<typeof AppLauncherWaffleGrid>;

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

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ minBlockSize: "400px", padding: "var(--space-4)" }}>
      <AppLauncherWaffleGrid isOpenByDefault={true} density="standard" />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "var(--space-8)", minBlockSize: "450px", padding: "var(--space-4)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Compact Trigger (Closed)
        </h4>
        <AppLauncherWaffleGrid isOpenByDefault={false} density="compact" />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Expanded Launcher Flyout
        </h4>
        <AppLauncherWaffleGrid isOpenByDefault={true} density="compact" />
      </div>
    </div>
  ),
};
