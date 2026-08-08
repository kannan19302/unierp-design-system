import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Popover } from "./overlays";
import { DropdownMenu } from "./overlays";
import { Tooltip } from "./overlays";
import { Drawer } from "./overlays";
import { Sheet } from "./overlays";
import { Button } from "./button";

// ── Popover ───────────────────────────────────────────

const meta: Meta<typeof Popover> = {
  title: "Overlays/Popover",
  component: Popover,
  parameters: {
    docs: {
      description: {
        component:
          "All overlay primitives share a single portal layer and focus-trap. Esc closes; nested overlays close innermost first.",
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  render: () => (
    <Popover
      trigger={<Button variant="secondary">Open popover</Button>}
    >
      <p style={{ margin: 0, fontSize: "var(--text-sm)" }}>
        Popover content — focus is <strong>not</strong> trapped here (non-modal).
      </p>
    </Popover>
  ),
};

// ── DropdownMenu ──────────────────────────────────────

export const MenuStory: StoryObj<typeof DropdownMenu> = {
  name: "DropdownMenu",
  render: () => (
    <DropdownMenu
      trigger={<Button variant="secondary">Actions ▾</Button>}
      items={[
        { key: "edit", label: "Edit", onClick: () => alert("Edit") },
        { key: "dup", label: "Duplicate", onClick: () => alert("Duplicate") },
        { key: "sep", label: "──────────", disabled: true },
        { key: "del", label: "Delete", danger: true, onClick: () => alert("Delete") },
      ]}
    />
  ),
};

// ── Tooltip ───────────────────────────────────────────

export const TooltipStory: StoryObj<typeof Tooltip> = {
  name: "Tooltip",
  render: () => (
    <div style={{ padding: "40px" }}>
      <Tooltip content="Keyboard shortcut: ⌘K">
        <Button>Hover or focus me</Button>
      </Tooltip>
    </div>
  ),
};

// ── Drawer ────────────────────────────────────────────

export const DrawerStory: StoryObj<typeof Drawer> = {
  name: "Drawer",
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open drawer</Button>
        <Drawer
          open={open}
          onClose={() => setOpen(false)}
          title="Record details"
          side="right"
        >
          <p>This drawer traps focus. Tab cycles within it. Esc closes it.</p>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </Drawer>
      </>
    );
  },
};

// ── Sheet ─────────────────────────────────────────────

export const SheetStory: StoryObj<typeof Sheet> = {
  name: "Sheet (bottom)",
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="secondary" onClick={() => setOpen(true)}>
          Open sheet
        </Button>
        <Sheet open={open} onClose={() => setOpen(false)} title="Quick actions" side="bottom">
          <p>Sheet content here. Scroll lock is active while this is open.</p>
        </Sheet>
      </>
    );
  },
};

// ── Nested overlays ───────────────────────────────────

export const NestedOverlays: Story = {
  name: "Nested overlays (Esc closes innermost first)",
  render: () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setDrawerOpen(true)}>Open drawer with nested menu</Button>
        <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Outer drawer">
          <p style={{ marginBottom: "var(--space-3)" }}>
            Esc closes the menu first, then a second Esc closes this drawer.
          </p>
          <DropdownMenu
            trigger={<Button variant="secondary">Nested menu ▾</Button>}
            items={[
              { key: "a", label: "Action A", onClick: () => {} },
              { key: "b", label: "Action B", onClick: () => {} },
            ]}
          />
        </Drawer>
      </>
    );
  },
};
