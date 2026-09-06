import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { PerspectiveModeSwitcher } from "./perspective-mode-switcher";

const meta: Meta<typeof PerspectiveModeSwitcher> = {
  title: "Navigation/PerspectiveModeSwitcher",
  component: PerspectiveModeSwitcher,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof PerspectiveModeSwitcher>;

const sampleModes = [
  { id: "list", label: "List", icon: <span>☰</span>, count: 142 },
  { id: "kanban", label: "Board", icon: <span>☷</span>, count: 142 },
  { id: "gantt", label: "Timeline", icon: <span>⫿</span> },
  { id: "calendar", label: "Calendar", icon: <span>📅</span> },
  { id: "pivot", label: "Pivot Matrix", icon: <span>🗀</span> },
];

export const Default: Story = {
  args: {
    modes: sampleModes,
    activeModeId: "list",
    density: "standard",
    onModeChange: (id) => alert(`Perspective changed to: ${id}`),
    onCustomizeView: () => alert("Customize view clicked"),
    onSaveView: () => alert("Save view clicked"),
  },
};

export const Compact: Story = {
  args: {
    modes: sampleModes,
    activeModeId: "kanban",
    density: "compact",
  },
};
