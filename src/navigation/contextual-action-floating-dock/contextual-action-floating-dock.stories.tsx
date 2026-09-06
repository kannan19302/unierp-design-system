import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ContextualActionFloatingDock } from "./contextual-action-floating-dock";

const meta: Meta<typeof ContextualActionFloatingDock> = {
  title: "Navigation/ContextualActionFloatingDock",
  component: ContextualActionFloatingDock,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof ContextualActionFloatingDock>;

const sampleActions = [
  { id: "dup", label: "Duplicate", shortcut: "D", onClick: () => alert("Duplicate") },
  { id: "split", label: "Split Line", shortcut: "S", onClick: () => alert("Split") },
  { id: "tag", label: "Add Tag", shortcut: "T", onClick: () => alert("Tag") },
  { id: "del", label: "Delete", shortcut: "Del", isDanger: true, onClick: () => alert("Delete") },
];

export const Default: Story = {
  args: {
    selectedCount: 3,
    actions: sampleActions,
    isOpen: true,
    density: "standard",
    onDismiss: () => alert("Dismiss dock"),
  },
};

export const Compact: Story = {
  args: {
    selectedCount: 1,
    actions: sampleActions,
    isOpen: true,
    density: "compact",
  },
};
