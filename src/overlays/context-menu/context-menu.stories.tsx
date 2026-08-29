import type { Meta, StoryObj } from "@storybook/react";
import { ContextMenu } from "./context-menu";
import { Edit, Trash2 } from "lucide-react";

const meta: Meta<typeof ContextMenu> = {
  title: "Overlays/ContextMenu",
  component: ContextMenu,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ContextMenu>;

export const Default: Story = {
  args: {
    children: (
      <div
        style={{
          padding: "var(--space-6)",
          border: "1px dashed var(--color-border)",
          borderRadius: "var(--radius-md)",
          background: "var(--color-bg-sunken)",
          textAlign: "center",
        }}
      >
        Right-click anywhere in this zone to view options
      </div>
    ),
    items: [
      { key: "edit", label: "Edit Record", icon: <Edit size={14} />, onClick: () => alert("Edit") },
      { key: "delete", label: "Delete Record", icon: <Trash2 size={14} />, danger: true, onClick: () => alert("Delete") },
    ],
  },
};
