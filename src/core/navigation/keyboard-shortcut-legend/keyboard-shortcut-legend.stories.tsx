import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { KeyboardShortcutLegend } from "./keyboard-shortcut-legend";

const meta: Meta<typeof KeyboardShortcutLegend> = {
  title: "Core/Navigation/KeyboardShortcutLegend",
  component: KeyboardShortcutLegend,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    a11y: { test: "todo" },
  },
};

export default meta;
type Story = StoryObj<typeof KeyboardShortcutLegend>;

const sampleShortcuts = [
  { id: "s1", label: "Open Enterprise Command Ribbon", keys: ["Ctrl", "K"], category: "Global Navigation" },
  { id: "s2", label: "Toggle Navigation Rail", keys: ["Ctrl", "B"], category: "Global Navigation" },
  { id: "s3", label: "New Transaction Record", keys: ["Alt", "N"], category: "Record Actions" },
  { id: "s4", label: "Save Active Document", keys: ["Ctrl", "S"], category: "Record Actions" },
  { id: "s5", label: "Close Active Blade", keys: ["Esc"], category: "Window Management" },
  { id: "s6", label: "Cycle Open Tabs", keys: ["Ctrl", "Tab"], category: "Window Management" },
  { id: "s7", label: "Toggle Ultra-Compact Density", keys: ["Alt", "D"], category: "Preferences" },
];

export const Default: Story = {
  args: {
    shortcuts: sampleShortcuts,
    isOpen: true,
    title: "System Keyboard Shortcuts",
    density: "standard",
    onClose: () => console.log("Close shortcut legend"),
  },
};

export const Compact: Story = {
  args: {
    shortcuts: sampleShortcuts,
    isOpen: true,
    title: "Keyboard Shortcuts",
    density: "compact",
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div>
      <KeyboardShortcutLegend
        shortcuts={sampleShortcuts}
        isOpen={true}
        title="UniERP Accelerator Legend"
        density="standard"
        onClose={() => {}}
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div>
      <KeyboardShortcutLegend
        shortcuts={sampleShortcuts.slice(0, 4)}
        isOpen={true}
        density="compact"
      />
    </div>
  ),
};
