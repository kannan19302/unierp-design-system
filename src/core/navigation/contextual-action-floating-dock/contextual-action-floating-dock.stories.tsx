import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ContextualActionFloatingDock } from "./contextual-action-floating-dock";

const meta: Meta<typeof ContextualActionFloatingDock> = {
  title: "Navigation/ContextualActionFloatingDock",
  component: ContextualActionFloatingDock,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    a11y: { test: "todo" },
  },
};

export default meta;
type Story = StoryObj<typeof ContextualActionFloatingDock>;

const sampleActions = [
  { id: "dup", label: "Duplicate", shortcut: "D", onClick: () => console.log("Duplicate") },
  { id: "split", label: "Split Line", shortcut: "S", onClick: () => console.log("Split") },
  { id: "tag", label: "Add Tag", shortcut: "T", onClick: () => console.log("Tag") },
  { id: "del", label: "Delete", shortcut: "Del", isDanger: true, onClick: () => console.log("Delete") },
];

export const Default: Story = {
  args: {
    selectedCount: 3,
    actions: sampleActions,
    isOpen: true,
    density: "standard",
    onDismiss: () => console.log("Dismiss dock"),
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

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ position: "relative", minBlockSize: "12rem" }}>
      <ContextualActionFloatingDock
        selectedCount={5}
        actions={sampleActions}
        isOpen={true}
        density="standard"
        onDismiss={() => {}}
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", padding: "var(--space-4)" }}>
      <ContextualActionFloatingDock
        selectedCount={1}
        actions={sampleActions.slice(0, 2)}
        isOpen={true}
        density="ultra-compact"
      />
      <ContextualActionFloatingDock
        selectedCount={2}
        actions={sampleActions.slice(0, 3)}
        isOpen={true}
        density="compact"
      />
      <ContextualActionFloatingDock
        selectedCount={4}
        actions={sampleActions}
        isOpen={true}
        density="standard"
      />
    </div>
  ),
};
