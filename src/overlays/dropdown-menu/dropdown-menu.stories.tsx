import type { Meta, StoryObj } from "@storybook/react";
import { DropdownMenu } from "./dropdown-menu";
import { Button } from "../../primitives/button";
import { Copy, Edit, Trash2 } from "lucide-react";

const meta: Meta<typeof DropdownMenu> = {
  title: "Overlays/DropdownMenu",
  component: DropdownMenu,
  tags: ["autodocs"],
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
