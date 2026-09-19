import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { WorkspacePaneLayoutSelector } from "./workspace-pane-layout-selector";

const meta: Meta<typeof WorkspacePaneLayoutSelector> = {
  title: "Navigation/WorkspacePaneLayoutSelector",
  component: WorkspacePaneLayoutSelector,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    a11y: { test: "todo" },
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
    onTogglePane: (pane) => console.log(`Toggled pane: ${pane}`),
    onSelectPreset: (preset) => console.log(`Selected preset: ${preset}`),
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

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <p style={{ marginBlockEnd: "var(--space-2)", fontWeight: "bold" }}>Standard Workbench Pane Selector</p>
        <WorkspacePaneLayoutSelector
          visibility={{ showLeftPane: true, showRightPane: true, showBottomPane: false }}
          activePreset="default"
          onTogglePane={() => {}}
          onSelectPreset={() => {}}
        />
      </div>
      <div>
        <p style={{ marginBlockEnd: "var(--space-2)", fontWeight: "bold" }}>Focused Single Pane Mode</p>
        <WorkspacePaneLayoutSelector
          visibility={{ showLeftPane: false, showRightPane: false, showBottomPane: false }}
          activePreset="focused"
          onTogglePane={() => {}}
        />
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <WorkspacePaneLayoutSelector
        visibility={{ showLeftPane: true, showRightPane: false, showBottomPane: false }}
        density="ultra-compact"
        onTogglePane={() => {}}
      />
      <WorkspacePaneLayoutSelector
        visibility={{ showLeftPane: true, showRightPane: true, showBottomPane: false }}
        density="compact"
        onTogglePane={() => {}}
      />
      <WorkspacePaneLayoutSelector
        visibility={{ showLeftPane: true, showRightPane: true, showBottomPane: true }}
        density="standard"
        onTogglePane={() => {}}
      />
      <WorkspacePaneLayoutSelector
        visibility={{ showLeftPane: false, showRightPane: false, showBottomPane: false }}
        density="comfortable"
        onTogglePane={() => {}}
      />
    </div>
  ),
};
