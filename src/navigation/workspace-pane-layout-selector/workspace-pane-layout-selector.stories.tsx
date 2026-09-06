import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { WorkspacePaneLayoutSelector } from "./workspace-pane-layout-selector";

const meta: Meta<typeof WorkspacePaneLayoutSelector> = {
  title: "Navigation/WorkspacePaneLayoutSelector",
  component: WorkspacePaneLayoutSelector,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof WorkspacePaneLayoutSelector>;

export const Default: Story = {
  args: {
    visibility: {
      showLeftPane: true,
      showRightPane: true,
      showBottomPane: false,
    },
    activePreset: "default",
    density: "standard",
    onTogglePane: (pane) => alert(`Toggled pane: ${pane}`),
    onSelectPreset: (preset) => alert(`Selected preset: ${preset}`),
  },
};

export const Compact: Story = {
  args: {
    visibility: {
      showLeftPane: true,
      showRightPane: false,
      showBottomPane: true,
    },
    activePreset: "terminal",
    density: "compact",
  },
};
