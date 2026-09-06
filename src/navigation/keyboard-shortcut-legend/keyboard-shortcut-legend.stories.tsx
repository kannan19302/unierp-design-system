import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { KeyboardShortcutLegend } from "./keyboard-shortcut-legend";

const meta: Meta<typeof KeyboardShortcutLegend> = {
  title: "Navigation/KeyboardShortcutLegend",
  component: KeyboardShortcutLegend,
  parameters: {
    layout: "fullscreen",
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
    onClose: () => alert("Close shortcut legend"),
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
