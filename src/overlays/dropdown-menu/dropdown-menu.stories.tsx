import type { Meta, StoryObj } from "@storybook/react";
import { DropdownMenu } from "./dropdown-menu";
import { Button } from "../../primitives/button";
import { Copy, Edit, Trash2 } from "lucide-react";

const meta: Meta<typeof DropdownMenu> = {
  title: "Overlays/DropdownMenu",
  component: DropdownMenu,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    a11y: {
      element: "#storybook-root",
      config: {
        rules: [{ id: "color-contrast", enabled: true }],
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DropdownMenu>;

export const Default: Story = {
  args: {
    trigger: <Button variant="outline">Row Actions</Button>,
    items: [
      { key: "edit", label: "Edit Entry", icon: <Edit size={14} />, onClick: () => alert("Edit") },
      { key: "clone", label: "Clone Line", icon: <Copy size={14} />, onClick: () => alert("Clone") },
      { key: "delete", label: "Delete", icon: <Trash2 size={14} />, danger: true, onClick: () => alert("Delete") },
    ],
  },
};

export const AnatomyAndComposition: Story = {
  name: "Anatomy & Composition",
  args: {
    ...Default.args,
  },
};

export const AllStatesGallery: Story = {
  name: "All States Gallery",
  render: () => (
    <div style={{ display: "flex", gap: "var(--space-6)", padding: "var(--space-8)" }}>
      <div>
        <h4 style={{ marginBottom: "var(--space-2)", color: "var(--color-text-secondary)" }}>Standard Actions Menu</h4>
        <DropdownMenu
          trigger={<Button variant="outline">Options ▾</Button>}
          items={[
            { key: "view", label: "View Audit History", onClick: () => {} },
            { key: "export", label: "Export CSV", onClick: () => {} },
            { key: "delete", label: "Archive Record", danger: true, onClick: () => {} },
          ]}
        />
      </div>

      <div>
        <h4 style={{ marginBottom: "var(--space-2)", color: "var(--color-text-secondary)" }}>Disabled Items Menu</h4>
        <DropdownMenu
          trigger={<Button variant="outline">Permissions ▾</Button>}
          items={[
            { key: "grant", label: "Grant Super Admin", disabled: true, onClick: () => {} },
            { key: "revoke", label: "Revoke Access", danger: true, onClick: () => {} },
          ]}
        />
      </div>
    </div>
  ),
};

