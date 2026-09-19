import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { PerspectiveModeSwitcher } from "./perspective-mode-switcher";

const meta: Meta<typeof PerspectiveModeSwitcher> = {
  title: "Navigation/PerspectiveModeSwitcher",
  component: PerspectiveModeSwitcher,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    a11y: { test: "todo" },
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
    onModeChange: (id) => console.log(`Perspective changed to: ${id}`),
    onCustomizeView: () => console.log("Customize view clicked"),
    onSaveView: () => console.log("Save view clicked"),
  },
};

export const Compact: Story = {
  args: {
    modes: sampleModes,
    activeModeId: "kanban",
    density: "compact",
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <p style={{ marginBlockEnd: "var(--space-2)", fontWeight: "bold" }}>Standard with Actions</p>
        <PerspectiveModeSwitcher
          modes={sampleModes}
          activeModeId="list"
          onModeChange={() => {}}
          onCustomizeView={() => {}}
          onSaveView={() => {}}
        />
      </div>
      <div>
        <p style={{ marginBlockEnd: "var(--space-2)", fontWeight: "bold" }}>Compact Modes Only</p>
        <PerspectiveModeSwitcher
          modes={sampleModes}
          activeModeId="kanban"
          density="compact"
          onModeChange={() => {}}
        />
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <PerspectiveModeSwitcher
        modes={sampleModes}
        activeModeId="list"
        density="ultra-compact"
        onModeChange={() => {}}
      />
      <PerspectiveModeSwitcher
        modes={sampleModes}
        activeModeId="kanban"
        density="compact"
        onModeChange={() => {}}
      />
      <PerspectiveModeSwitcher
        modes={sampleModes}
        activeModeId="gantt"
        density="standard"
        onModeChange={() => {}}
      />
      <PerspectiveModeSwitcher
        modes={sampleModes}
        activeModeId="calendar"
        density="comfortable"
        onModeChange={() => {}}
      />
    </div>
  ),
};
