import type { Meta, StoryObj } from "@storybook/react";
import { KeyboardShortcutsHelp } from "./keyboard-shortcuts-help";

const meta: Meta<typeof KeyboardShortcutsHelp> = {
  title: "Overlays/KeyboardShortcutsHelp",
  component: KeyboardShortcutsHelp,
  args: {
    isOpen: true,
    onClose: () => undefined,
    title: "Finance workspace shortcuts",
    shortcuts: [
      { group: "Navigation", keys: "Ctrl K", label: "Open command palette" },
      { group: "Navigation", keys: "Alt 1–9", label: "Switch tab" },
      { group: "View", keys: "Ctrl B", label: "Toggle sidebar" },
      { group: "Actions", keys: "Esc", label: "Close overlay" },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof KeyboardShortcutsHelp>;

export const Default: Story = {};
