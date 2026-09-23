import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ShortcutCheatSheet } from "./shortcut-cheat-sheet";
import { Button } from "../../primitives/button";
import type { ShortcutDefinition } from "../../hooks/use-keyboard-shortcuts";

const meta: Meta<typeof ShortcutCheatSheet> = {
  title: "Core/Overlays/ShortcutCheatSheet",
  component: ShortcutCheatSheet,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    a11y: {
      config: {
        rules: [{ id: "color-contrast", enabled: true }],
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ShortcutCheatSheet>;

const sampleShortcuts: ShortcutDefinition[] = [
  {
    id: "cmd-palette",
    keys: "Ctrl+K",
    description: "Open universal command palette",
    category: "Global",
    handler: () => {},
  },
  {
    id: "help-sheet",
    keys: "?",
    description: "Show keyboard shortcut cheat sheet",
    category: "Global",
    handler: () => {},
  },
  {
    id: "go-dashboard",
    keys: "g d",
    description: "Jump to Executive Dashboard",
    category: "Navigation",
    handler: () => {},
  },
  {
    id: "go-invoices",
    keys: "g i",
    description: "Jump to Invoices & Billing",
    category: "Navigation",
    handler: () => {},
  },
  {
    id: "go-settings",
    keys: "g s",
    description: "Jump to System Configuration",
    category: "Navigation",
    handler: () => {},
  },
  {
    id: "grid-down",
    keys: "j",
    description: "Move focus down one row",
    category: "Data Grid",
    handler: () => {},
  },
  {
    id: "grid-up",
    keys: "k",
    description: "Move focus up one row",
    category: "Data Grid",
    handler: () => {},
  },
  {
    id: "grid-select",
    keys: "x",
    description: "Toggle selection of focused row",
    category: "Data Grid",
    handler: () => {},
  },
  {
    id: "save-record",
    keys: "Ctrl+S",
    description: "Save active document or form",
    category: "Editing",
    handler: () => {},
  },
];

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(true);

    return (
      <div>
        <Button variant="secondary" onClick={() => setOpen(true)}>
          Show Shortcut Cheat Sheet (Press ?)
        </Button>
        <ShortcutCheatSheet
          open={open}
          onClose={() => setOpen(false)}
          shortcuts={sampleShortcuts}
        />
      </div>
    );
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ position: "relative", minHeight: "500px", width: "100%" }}>
      <ShortcutCheatSheet
        open={true}
        onClose={() => {}}
        shortcuts={sampleShortcuts.slice(0, 5)}
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div style={{ position: "relative", minHeight: "450px" }}>
        <h4 style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-sans)", margin: "0 0 var(--space-2) 0" }}>
          Full Navigation & Grid Cheat Sheet
        </h4>
        <ShortcutCheatSheet
          open={true}
          onClose={() => {}}
          shortcuts={sampleShortcuts}
        />
      </div>
    </div>
  ),
};
